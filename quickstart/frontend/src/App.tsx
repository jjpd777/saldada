
import React, { useState,  useEffect, useContext, useCallback } from "react";

import Header from "./Components/Headers";
import Products from "./Components/ProductTypes/Products";
import Items from "./Components/ProductTypes/Items";
import Context from "./Context";
import saldada from "./saldada-new.png";
import styles from "./App.module.scss";


const App = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND || "http://localhost:8000";

  //
  console.log("BACKEND DISPLAYED", BACKEND_URL)
  const [catchE, setCatchE] = useState("- Not retrieved -")
  const { linkSuccess, isItemAccess, dispatch } = useContext(Context);

  const getInfo = useCallback(async () => {
    const p = BACKEND_URL + "/api/info"
    const response = await fetch(p,
    { method: "POST",
    headers:{
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",

    } 
  })

  console.log("\n===> INFO ENDPOINT RESPONSE:\n", response)
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }

    const data = await response.json();
    console.log("\nData retrieved\n", data);
    const paymentInitiation: boolean = false;
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
      },
    });
    return { paymentInitiation };
  }, [dispatch]);

 

  const generateToken = useCallback(
    async (paymentInitiation) => {
      const path = BACKEND_URL + "/api/create_link_token";
        console.log(path, "this is the path")
      const response = await fetch(path, {
        method: "POST",
        headers:{
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        } 
      });
      console.log("\nGENERATE TOKEN RESPONSE:\n", response);
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        console.log("\nERROR TOKEN RESPONSE:\n", response)
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
