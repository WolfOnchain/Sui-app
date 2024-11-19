import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from 'react-dom/client';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from  '@mysten/sui/client';
import '@mysten/dapp-kit/dist/index.css';
import { ConnectButton, useCurrentAccount, useSuiClientQuery  } from '@mysten/dapp-kit';


const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider> 
          <App/>
        </WalletProvider>
       

      </SuiClientProvider>

    </QueryClientProvider>
  </React.StrictMode>,
);

function App()  {
  return (
    <div className="App">
      <header className ="App-header">
      <ConnectButton />
      </header>
      <ConnectedAccount />
    </div>
  );
}

function ConnectedAccount() {
  const account = useCurrentAccount();

  if (!account) {
    return null;

  }
  return (<div> 
    <div>Connected to {account.address}</div>;
    <OwnedObjects address={account.adress}/>
   
   </div>
   );
}

function OwnedObjects({ address }: {address: string }) {
  const { data } = useSuiClientQuery('getOwnedObjects', {
    owner: address, 
  });

  if (!data) {
    return null;
  }

  return (
    <ul>
      {data.data.map((object)=>( <li key={object.data?.objectId}>
        <a href={`https://example-explorer.com/object/${object.data?.objectId}`}>
        {object.data?.objectId}
        </a>
      </li>

      ) )}
    </ul>
  );
}
