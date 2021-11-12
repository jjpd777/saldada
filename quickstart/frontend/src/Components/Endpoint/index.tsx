import React, { useState } from "react";
import Button from "plaid-threads/Button";
import Note from "plaid-threads/Note";

import Table from "../Table";
import Error from "../Error";
import { DataItem, Categories, ErrorDataItem, Data } from "../../dataUtilities";

import styles from "./index.module.scss";
import { type } from "os";

interface Props {
  endpoint: string;
  name?: string;
  categories: Array<Categories>;
  schema: string;
  description: string;
  transformData: (arg: any) => Array<DataItem>;
}

const Endpoint = (props: Props) => {
  const [showTable, setShowTable] = useState(false);
  const [transformedData, setTransformedData] = useState<Data>([]);
  const [pdf, setPdf] = useState<string | null>(null);
  const [error, setError] = useState<ErrorDataItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = process.env.BACKEND ? process.env.BACKEND : "http://localhost:8000";


  const getData = async () => {
    setIsLoading(true);
    const p = BACKEND_URL +"/api/" + props.endpoint;
    const response = await fetch(p, 
    { method: "GET",
    headers:{
      "Access-Control-Allow-Origin": "*",
    } 
   },
    );
    const data = await response.json();
    console.log("\nGET DATA RESPONSE:\n", data)

    if (data.error != null) {
      console.log("API FETCH ERROR", data.error)
      setError(data.error);
      setIsLoading(false);
      return;
    }
    setTransformedData(props.transformData(data)); // transform data into proper format for each individual product
    
    if (data.pdf != null) {
      setPdf(data.pdf);
    }
    setShowTable(true);
    setIsLoading(false);
  };
  
  console.log("\n- - - ENDPOINT PROPS - - -", props);
  console.log("\n Transformed data, type: ", typeof(transformedData), transformedData);
  return (
    <>
      <div className={styles.endpointContainer}>
        <Note info className={styles.post}>
          POST
        </Note>
        <div className={styles.endpointContents}>
          <div className={styles.endpointHeader}>
            {props.name != null && (
              <span className={styles.endpointName}>{props.name}</span>
            )}
            <span className={styles.schema}>{props.schema}</span>
          </div>
          <div className={styles.endpointDescription}>{props.description}</div>
        </div>
        <div className={styles.buttonsContainer}>
          <Button
            small
            centered
            wide
            secondary
            className={styles.sendRequest}
            onClick={getData}
          >
            {isLoading ? "Loading..." : `Send request`}
          </Button>
          {pdf != null && (
            <Button
              small
              centered
              wide
              className={styles.pdf}
              href={`data:application/pdf;base64,${pdf}`}
              componentProps={{ download: "Asset Report.pdf" }}
            >
              Download PDF
            </Button>
          )}
        </div>
      </div>
      {showTable && (
        <Table
          categories={props.categories}
          data={transformedData}
          isIdentity={props.endpoint === "identity"}
        />
      )}
      {error != null && <Error error={error} />}
    </>
  );
};

Endpoint.displayName = "Endpoint";

export default Endpoint;
