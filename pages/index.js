import { useState, useEffect } from "react"
import { NFTCard } from "../components/nftCard"
import Head from "next/head"

const Home = () => {
  const [wallet, setWallet] = useState("")
  const [collection, setCollectionAddress] = useState("")
  const [NFTs, setNFTs] = useState([])
  const [startToken, setStartToken] = useState(null)
  const [showButton, setShowButton] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
    fetchNFTs();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });
  };

  // Fetch API 

  const fetchNFTs = async (isNext) => {
    if(collection.length === 0 && wallet.length === 0) {
      return;
    }

    try {
      const method = collection.length > 0 && wallet.length === 0 ? "getNFTsForCollection" : "getNFTs";
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/${method}/`;
      let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      let fetchURL;

      if(collection.length > 0 && wallet.length === 0) {
        fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=true`;
      } else if(!collection.length) {
        fetchURL = `${baseURL}?owner=${wallet}`;
      } else {
        fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      }

      if (isNext && startToken) {
        if (method === "getNFTsForCollection") {
          fetchURL = `${fetchURL}&startToken=${startToken}`;
        } else if (method === "getNFTs") {
          fetchURL = `${fetchURL}&pageKey=${startToken}`;
        }
      } else {
        setStartToken(null);
      }

      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());

      if(nfts) {
        console.log(nfts.nextToken)
        if(nfts.nfts) {
        if(isNext) {
          setNFTs([...NFTs,...nfts.nfts])
          console.log(NFTs.length)
          console.log("NFTs in collection:", nfts)  
        } else {
        setNFTs(nfts.nfts)
        }
        setStartToken(nfts.nextToken)
      } else if (nfts.ownedNfts) {
        if(isNext) {
          setNFTs([...NFTs, ...nfts.ownedNfts]);
        } else {
          setNFTs(nfts.ownedNfts);
        }
          setStartToken(nfts.pageKey)
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsInitialized(true);
    }
    
  }

  const onKeyPress = (e) => {
    if(e.which === 13) {
      fetchNFTs();
    }
  }

   return (
    <div className="min-h-screen bg-slate-900">
      <Head>
          <title>NFT Gallery</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
      </Head>      
      <div className="flex flex-col items-center justify-center py-8 gap-y-3 font-sans ">
      <h1 className="text-5xl text-white font-semibold mt-4 mb-2">NFT Gallery</h1>
      <div className="flex flex-column justify-center items-center gap-y-2 gap-x-5 mt-3 bg-white rounded-lg p-10 w-5/6">
        <input className="ring-2 ring-slate-300 w-3/5 bg-slate-200 py-3 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {setWallet(e.target.value)}} 
          value={wallet} 
          type={"text"} 
          placeholder="Add your wallet address"
          onKeyPress={onKeyPress}
        >
        </input>
        <input className="ring-2 ring-slate-300 w-3/5 bg-slate-200 py-3 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {setCollectionAddress(e.target.value)}} 
          value={collection} 
          type={"text"} 
          placeholder="Add the collection address"
          onKeyPress={onKeyPress}
        >
        </input>
        <button 
          className="disabled:bg-slate-500 text-white bg-blue-700 px-2 py-3 rounded-md w-2/5 hover:bg-blue-800 active:bg-blue-900"
          onClick={ () => {fetchNFTs()}}>
        
          Show NFTs</button>
      </div>
      {isInitialized && (
      <div className="flex flex-wrap gap-y-10 mt-4 w-5/6 gap-x-6 justify-center bg-white rounded-lg">
        {
          NFTs.map((nft, index) => {
            return (
              <NFTCard nft={nft} key={index}></NFTCard>
            )
          })
        }
        
      {startToken ? 
          <button 
            className={"text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-4 py-2 mt-6 mb-7 rounded-md w-3/4"}
            onClick={() => {fetchNFTs()}}>
            Show More
          </button>
          : <></> } 
      </div>
      )}
      </div>

      {showButton && (
        <svg 
          onClick={scrollToTop} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 330 330" 
          className="fixed bottom-20 w-7 right-3 md:w-10 md:right-5 lg:w-15 lg:right-7 xl:w-15 xl:right-10 2xl:w-15 2xl:right-10 opacity-85 fill-white hover:animate-bounce active:animate-pulse">        
          <path 
            id="XMLID_224_" 
            d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
               l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
               C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
          />
        </svg>
      )}
    </div>
  )
}

export default Home
