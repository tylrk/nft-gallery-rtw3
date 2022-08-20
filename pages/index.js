import { useState, useEffect } from "react"
import { NFTCard } from "../components/nftCard"

const Home = () => {
  const [wallet, setWallet] = useState("")
  const [collection, setCollectionAddress] = useState("")
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)
  const [startToken, setStartToken] = useState('')
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });
  };

  // Fetch API 

  const fetchNFTs = async () => {
    let nfts;
    if(!collection.length) {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      console.log("fetching nfts");
   
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs/`;
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } /*else {
        console.log("fetching nfts for collection owned by address")
        const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
        nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } */

    if(nfts) {
      console.log("nfts:", nfts);
      setNFTs([...NFTs, ...nfts.ownedNfts]);

      if(nfts.pageKey) {
        setStartToken(nfts.pageKey)
      }
    }

    if(collection.length) {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${startToken}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if(nfts) {
        console.log(nfts.nextToken)

        if(nfts.nextToken) {
          setStartToken(nfts.nextToken)
        }
        console.log(NFTs.length)
        console.log("NFTs in collection:", nfts)

        if(NFTs.length > 0) {
          setNFTs([...NFTs,...nfts.nfts])
        } else {
        setNFTs(nfts.nfts)
        }

      }
    }
  }

  // Fetch API

 /* const fetchNFTsForCollection = async () => {
    
  } */

  const onKeyPress = (e) => {
    if(e.which === 13) {
      fetchNFTs();
    }
  }


   return (
    <>
    <div className="flex flex-col items-center justify-center py-8 gap-y-3 font-mono">
      <h1 className="text-4xl text-blue-500 font-semibold">NFT Gallery</h1>
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          //disabled={fetchForCollection}
          onChange={(e) => {setWallet(e.target.value)}} 
          value={wallet} 
          type={"text"} 
          placeholder="Add your wallet address"
          onKeyPress={onKeyPress}
        >
        </input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {setCollectionAddress(e.target.value)}} 
          value={collection} 
          type={"text"} 
          placeholder="Add the collection address"
          onKeyPress={onKeyPress}
        >
        </input>
        <button 
          className="disabled:bg-slate-500 text-white bg-blue-500 px-4 py-2 mt-3 rounded-md w-2/5 hover:bg-blue-600 active:bg-blue-700"
          onClick={ () => { fetchNFTs()}}>
        
          Fetch NFTs</button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-6 justify-center">
        {
          NFTs.length && NFTs.map((nft, index) => {
            return (
              <NFTCard nft={nft} key={index}></NFTCard>
            )
          })
        }
      </div>
      {startToken ? 
          <button 
            className={"disabled:bg-slate-500 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-4 py-2 mt-6 rounded-md w-1/4"}
            onClick={
              () => {
                if (fetchForCollection) {
                  fetchNFTsForCollection()
                } else fetchNFTs()
              }
            }
          >
            Show More
          </button>
          : <></> } 
    </div>

      {showButton && (
        <svg 
          onClick={scrollToTop} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 330 330" 
          className="fixed bottom-20 w-11 right-20 opacity-75 hover:animate-bounce active:animate-pulse">        
          <path 
            id="XMLID_224_" 
            d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
               l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
               C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
          />
        </svg>
      )}
    </>
  )
}

export default Home
