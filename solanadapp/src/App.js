import { Connection, Keypair, clusterApiUrl,LAMPORTS_PER_SOL,PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { useState } from "react";
import { Buffer } from "buffer";


export default function App() {
  const [Toadd,setToadd]=useState('');
  const [Fromadd,setFromadd]=useState('');
  const [keypair,setkeypair]=useState();
  const [connection,setConnection]=useState();
  window.Buffer=Buffer;
  const ConnectWallet = async ()=>
  {
       const {solana} =window;
       if(solana)
       {
        try{

          const response = await solana.connect(); 
          console.log(response.publicKey.toString());
          setToadd(response.publicKey.toString());
        }
        catch(err)
        {
          console.error(err);
        }
       }
  }

  const Transfer = async () => {
  

      try {
        console.log("trying.....");
        const transaction = new Transaction();
        const instruction =  SystemProgram.transfer({
          fromPubkey: new PublicKey(Fromadd),
          toPubkey: new PublicKey(Toadd),
          lamports: 1 * LAMPORTS_PER_SOL,
        });
         transaction.add(instruction);

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair], 
         
        );

        console.log('Transaction Signature:', signature);
      } catch (err) {
        console.error(err);
      }
  
  };
  const CreateKeyPair = async ()=>
  {
   const keypair= Keypair.generate();
   setkeypair(keypair);
   const pubkey=keypair.publicKey.toString();
   console.log("PublicKey :" ,pubkey);
   setFromadd(pubkey);
   const con=new Connection(clusterApiUrl('devnet'));
   setConnection(con);
   try
   {
    await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL); 
    console.log(" Airdropped 2 SOl "); 
   }
   catch(err)
   {
      console.error(err);
   }
  }
  return (
    <div className="w-full h-screen">
      <nav className="w-full h-[100px] bg-black flex  justify-between items-center px-4 ">
        <ul className="text-white font-serif flex  justify-center items-center">
            <li className="mr-4 px-2">Solana</li>
          
        </ul>
        <div className="text-white flex items-center w-1/3  justify-end">
          <button className="bg-blue-600 rounded-lg px-8 py-2 hover:scale-105" onClick={CreateKeyPair}>Create Account</button>
          <button className="bg-blue-600 rounded-lg px-4 py-2 hover:scale-105 ml-5" onClick={ConnectWallet}>
            {!Toadd ? "Connect" : Toadd.toString().substring(0,6)+"..." }</button>
        </div>
      </nav>
      <div className=" w-[600px] mx-auto bg-gray-500 border-blue-300 border-2 h-[300px] py-8 px-8 mt-4 rounded-lg ">
        <form className="flex flex-col justify-start items-start">
         <label className="py-4 px-4 mr-4"> From add : <input type="text" value={Fromadd}  readOnly className="w-[400px] px-4 rounded-md "></input></label>
         <label className="py-3 px-6">To add : <input type="text" value={Toadd} readOnly className="w-[400px] px-4 rounded-md mr-4"></input></label>
         <button type="button" onClick={Transfer} className="text-center bg-green-700 py-4 rounded-lg w-3/4 mx-auto mt-12 hover:scale-105" >Transfer</button>
        </form>
        
      </div>
      
    </div>
  )
}