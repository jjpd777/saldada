
import React, { useContext } from "react";
import Callout from "plaid-threads/Callout";
import Button from "plaid-threads/Button";
import InlineLink from "plaid-threads/InlineLink";
import Note from "plaid-threads/Note";


import Link from "../Link";
import Context from "../../Context";

import styles from "./index.module.scss";

const Header = () => {
  const {
    itemId,
    accessToken,
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
  } = useContext(Context);

  return (
    <div className={styles.grid}>
      <h3 className={styles.title}>Net-30 Financing at No Cost</h3>

      {!linkSuccess ? (
        <>
          <h4 className={styles.subtitle}>
            Better Terms with your Merchants from Day One
          </h4>
          <p className={styles.introPar}>
            Saldada brings transparency to commerce across the Americas.
            We use open banking to assess & facilitate payment advancements to merchants abroad. 
          </p>
          <p>Upon approval, you will be able to <b>enjoy Net-30, Net-60 or Net-90 terms</b> on your merchandise at no cost!</p>
          <p>
            The whole process should take less than 2 minutes. 
          </p>
          <Note info className={styles.hiw}>
          <h4><b>How it works</b></h4>
          </Note>
          <p>
          <i>STEP 1 {'=>'}  <b>LOGIN</b></i> <br></br>Click on the <i>Launch Plaid</i> button bellow, and
          proceed to login with your preferred financial institution via  <b><a href="https://www.plaidmir">plaid.com</a></b>
          </p>
          <p>
          <i>STEP 2 {'=>'}  <b>ALLOW VIEW TRANSACTIONS</b></i> <br></br>
          Plaid will request access to view your <i>Transaction History</i>.
          Following your confirmation, we will show you exactly what transactions information we are retrieving.
          </p>
          <p>
          <i>STEP 3 {'=>'} <b>LOGOUT</b></i> <br></br>
          Finally, simply click on <i>Share with Saldada</i>. 
          After sharing the transactions history, you will be automatically logged out and all your sensible information will be deleted.
          </p>
          <Note info className={styles.disclaimer}>
          <h4><b>You are in control</b></h4>
          </Note>
          <p>
          i. Your account <b>will never get charged. </b> 
          Our access to your transactions data is <b>read-only</b>, which means
          that you have zero risk of getting charged anything, ever.
          </p>

          <p>
          ii. 
          Your banking <b>credentials will not be stored</b>. We only keep the transaction history data,
          and all other sensible information gets deleted. 
          </p>

          <p>
          iii. Your data <b>will not be shared</b> with any 3rd parties or other financial institutions. All sensible financial information is retrieved using <b><a href="https://www.plaid.com">plaidist</a></b>, 
          and kept confidential.
          </p>
          {/* message if backend is not running and there is no link token */}
          {!backend ? (
            <Callout warning>
              Unable to fetch link_token: please make sure your backend server
              is running and that your .env file has been configured with your
              <code>PLAID_CLIENT_ID</code> and <code>PLAID_SECRET</code>.
            </Callout>
          ) : /* message if backend is running and there is no link token */
          linkToken == null && backend ? (
            <Callout warning>
              <div>
                Unable to fetch link_token: please make sure your backend server
                is running and that your .env file has been configured
                correctly.
              </div>
              <div>
                Error Code: <code>{linkTokenError.error_code}</code>
              </div>
              <div>
                Error Type: <code>{linkTokenError.error_type}</code>{" "}
              </div>
              <div>Error Message: {linkTokenError.error_message}</div>
            </Callout>
          ) : linkToken === "" ? (
            <div className={styles.linkButton}>
              <Button large disabled>
                Loading...
              </Button>
            </div>
          ) : (
            <div className={styles.linkButton}>
              <Link />
            </div>
          )}
        </>
      ) : (
        <>
          {isItemAccess ? (
            <h4 className={styles.subtitle}>
              Congrats! By linking an account, you have created an{" "}
              <InlineLink
                href="http://plaid.com/docs/quickstart/glossary/#item"
                target="_blank"
              >
                Item
              </InlineLink>
              .
            </h4>
          ) : (
            <h4 className={styles.subtitle}>
              <Callout warning>
                Unable to create an item. Please check your backend server
              </Callout>
            </h4>
          )}
          <div className={styles.itemAccessContainer}>
            <p className={styles.itemAccessRow}>
              <span className={styles.idName}>item_id</span>
              <span className={styles.tokenText}>{itemId}</span>
            </p>

            <p className={styles.itemAccessRow}>
              <span className={styles.idName}>access_token</span>
              <span className={styles.tokenText}>{accessToken}</span>
            </p>
          </div>
          {isItemAccess && (
            <p className={styles.requests}>
              Now that you have an access_token, you can make all of the
              following requests:
            </p>
          )}
        </>
      )}
    </div>
  );
};

Header.displayName = "Header";

export default Header;
