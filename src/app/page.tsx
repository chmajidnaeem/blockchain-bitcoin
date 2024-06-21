'use client'
import { useEffect } from "react";
import Pusher from "pusher-js";
import { Transak, TransakConfig } from "@transak/transak-sdk";

// Public channel for all transak order events
let pusher = new Pusher("e6b6d85f329b34a28fd2", { cluster: "ap2" });

const App = () => {
  useEffect(() => {
    /**
     * CallData for buying Bitcoin
     */
    const calldata = "0xf6ad7342...";

    if (!calldata) return;

    const settings: TransakConfig = {
      /**
       * API key for the Transak API
       */
      apiKey: "6e0c77ba-9070-4763-ac94-b40d0c85ffc1",
      //47585a55-2604-4d30-aac7-8bbf6b2250a1
      
      /**
       * Environment for the Transak API
       */
      environment: Transak.ENVIRONMENTS.STAGING,
      themeColor: "000000",
      defaultPaymentMethod: "credit_debit_card",
      /**
       * User wallet address. This is the address where Bitcoin will be sent
       */
      walletAddress: "",
      exchangeScreenTitle: "Buy Bitcoin",
      disableWalletAddressForm: true,
      estimatedGasLimit: 70_000,
      calldata,
      /**
       * Network on which the Bitcoin is being bought
       */
      network: "bitcoin",
  
      /**
       * Source token for buying Bitcoin
       */
      cryptoCurrencyCode: "BTC",
      /**
       * Details of the Bitcoin being bought by the user
       */
      nftData: [], // No NFT data needed for buying Bitcoin
      isNFT: false, // Not an NFT purchase
      /**
       * The contract id for a partner api key
       * You will get this contract id from transak
       */
    };

    const transak = new Transak(settings);

    transak.init();

    const subscribeToWebsockets = (orderId: string) => {
      let channel = pusher.subscribe(orderId);

      // Receive updates of all the events
      pusher.bind_global((eventId: any, orderData: any) => {
        console.log(`websocket Event: ${eventId} with order data:`, orderData);
      });

      // Receive updates of a specific event
      channel.bind("ORDER_COMPLETED", (orderData: any) => {
        console.log("ORDER COMPLETED websocket event", orderData);
      });

      channel.bind("ORDER_FAILED", async (orderData: any) => {
        console.log("ORDER FAILED websocket event", orderData);
      });
    };

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData: any) => {
      console.log("callback transak order created", orderData);
      const eventData = orderData;

      const orderId = eventData.status?.id;

      if (!orderId) {
        return;
      }

      subscribeToWebsockets(orderId);
    });
  }, []);

  return (
    <div className="App">
      <h1>BTC</h1>
      <h2>bitcoin</h2>
      <iframe
                id="transakIframe"
                src="https://global-stg.transak.com/?apiKey=<YOUR_API_KEY>&<QUERY_PARAMETERS>"
                allow="camera;microphone;payment"
                >
            </iframe>
    </div>
  );
};

export default App;

//https://api-stg.transak.com/partners/api/v2/refresh-token