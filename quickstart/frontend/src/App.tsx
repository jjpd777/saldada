
import React, { useState,  useEffect, useContext, useCallback } from "react";

import Header from "./Components/Headers";
import Products from "./Components/ProductTypes/Products";
import Items from "./Components/ProductTypes/Items";
import Context from "./Context";
import saldada from "./saldada-new.png";
import styles from "./App.module.scss";
require('dotenv').config();

const App = () => {
  console.log("ENV VAR", process.env.PLAID_SECRET)
  const [catchE, setCatchE] = useState("- Not retrieved -")
  const { linkSuccess, isItemAccess, dispatch } = useContext(Context);
  const getInfo = useCallback(async () => {
    const response = await fetch("/api/info", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }

    const data = await response.json();
    const paymentInitiation: boolean = data.products.includes(
      "payment_initiation"
    );
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
      },
    });
    console.log("- - - Payment Initiation - - -\n", paymentInitiation)
    return { paymentInitiation };
  }, [dispatch]);

  useEffect(()=>{
    console.log("\nERROR FETCHING FROM BACKEND\n", catchE);
    
  const testAPI = async() =>{
    const r = await fetch("https://saldada-deploy.herokuapp.com/t", {
      method:"GET",
      mode: "cors",
      headers:{
        'Content-type' : 'application/json'
      }
    }).catch(e=>{
      console.log("CORS ERROR", e)
    })
  };
  testAPI();
  },[catchE])

  const generateToken = useCallback(
    async (paymentInitiation) => {
      const path = paymentInitiation
        ? "/api/create_link_token_for_payment"
        : "/api/create_link_token";
      const response = await fetch(path, {
        method: "POST",
      
      });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      console.log("- - - Link Token - - -", data);
      if (data) {
        setCatchE(data);
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      localStorage.setItem("link_token", data.link_token); //to use later for Oauth
    },
    [dispatch]
  );

  useEffect(() => {
    const init = async () => {
      const { paymentInitiation } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        console.log('- - - Window Locator - - -', window.location.href)
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      generateToken(paymentInitiation);
    };
    init();
  }, [dispatch, generateToken, getInfo]);

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <img className={styles.topImage} src={saldada}></img>
        <Header />
        {linkSuccess && isItemAccess && (
          <>
            <h4>Products Options</h4>
            <Products />
            <h4>Items Options</h4>
            <Items />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
