'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/navigation';
import { FaTrashAlt } from "react-icons/fa";


export const TrackAccount = () => {
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [allTrackAddress, setAllTrackAddress] = useState<{ id: number, accountAddress: string, amount: number }[]>([]);
  const [editStates, setEditStates] = useState<{ [key: number]: boolean }>({});
  const [updatedAmounts, setUpdatedAmounts] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false);


  const { data: session } = useSession()
  const name = session?.user?.name
  const userId = session?.user?.userId
  const router = useRouter()

  if (!name || !userId) {
    router.push('/login')
  }


  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://solert.mach-india.com/api/v1/accounts/trackAddress?userId=${userId}`);
      setAllTrackAddress(response.data.data);

    } catch (error) {
      console.error('Error fetching tracked addresses:', error);
    } finally {
      setLoading(false)
    }
  };




  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);




  const updateAmount = async (id: number) => {
    try {
      await axios.patch('https://solert.mach-india.com/api/v1/accounts/trackAddress', { id, amount: updatedAmounts[id] });
      fetchData()
      // setAllTrackAddress(allTrackAddress.map(item => item.id === id ? { ...item, amount: updatedAmounts[id] } : item));
      setEditStates({ ...editStates, [id]: false });  // Disable edit mode after updating
    } catch (error) {
      console.error('Error updating amount:', error);
    }
  };


  const deleteTrackAddress = async (id: number) => {
    try {
      await axios.delete('https://solert.mach-india.com/api/v1/accounts/trackAddress', { data: { id } });
      setAllTrackAddress(allTrackAddress.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };


  const addAccount = async () => {
    setLoading(true)
    try {
      if (userId) {
        const response = await axios.post(`https://solert.mach-india.com/api/v1/accounts/trackAddress?userId=${userId}`, { address, amount });
        fetchData()
        // setAllTrackAddress([...allTrackAddress, response.data.data]);
        setAmount(0);
        setAddress('');
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };


  const toggleEditMode = (id: number) => {
    setEditStates({ ...editStates, [id]: !editStates[id] });
    setUpdatedAmounts({ ...updatedAmounts, [id]: allTrackAddress.find(item => item.id === id)?.amount || 0 });
  };


  return (
    <div className='h-[80vh] mb-8'>
      <div className='flex gap-4 p-7'>
        <div className='w-2/5 '>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              const inputAddress = e.target.value;
              setAddress(inputAddress)


              // Validate the address and update state
              if (validateSolanaAddress(inputAddress)) {
                setIsAddressValid(true);
              } else {
                setIsAddressValid(false);
              }
            }
            }
            placeholder="Enter SOL Address"
            className='border rounded-lg p-2 w-full outline-none text-slate-600 dcex-address-input'
          />
          {!isAddressValid && address.length > 0 && (
            <p style={{ color: 'red' }}>Invalid Solana address</p>
          )}
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            setAmount(Number(value.replace(/^0+/, '')));
          }}
          placeholder="Enter Amount"
          className='border rounded-lg p-2 w-2/5 outline-none text-slate-600 mb-6 dcex-amount-input'
        />
        <button onClick={addAccount} disabled={!isAddressValid} className={`bg-black text-white py-2 px-4 rounded-lg w-1/5 ${isAddressValid ? "active:text-xl cursor-pointer" : ""} mb-6 dcex-add-button`}>Add</button>
      </div>


      <div className='mt-8 h-[50vh] overflow-y-scroll  overflow-x-hidden  p-3 shadow-xl track-address-container'>
        {loading ? (<p className='text-center mt-12'>Loading...</p>) : (
          <ul>
            {allTrackAddress.length > 0 ? (
              allTrackAddress.map((item) => (
                <li key={item.id} className='flex gap-4 text-slate-600 mb-4  '>
                  <p className='bg-gray-100 py-1 px-2 rounded-lg w-8/12 dcex-account-address'>{item.accountAddress}</p>
                  <input
                    type="number"
                    value={editStates[item.id] ? updatedAmounts[item.id] : item.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUpdatedAmounts({ ...updatedAmounts, [item.id]: Number(value.replace(/^0+/, '')) });
                    }}
                    placeholder="Update"
                    disabled={!editStates[item.id]}
                    className='text-slate-600 border py-2 px-1 rounded-lg w-2/12 outline-none dcex-update-amount'
                  />
                  <button
                    onClick={() => editStates[item.id] ? updateAmount(item.id) : toggleEditMode(item.id)}
                    className='bg-black text-white py-2 px-2 rounded-lg w-1/12 dcex-update-button'
                  >
                    {editStates[item.id] ? 'Update' : 'Edit'}
                  </button>
                  <button onClick={() => deleteTrackAddress(item.id)} className='bg-black text-white py-2 px-1 rounded-lg w-1/12 dcex-delete-button'><FaTrashAlt /></button>
                </li>


              ))
            ) : (<p className="text-center mt-16 text-2xl">Please add address you want to track</p>)}


          </ul>)}
      </div>
    </div>
  );
};




const validateSolanaAddress = (inputAddress: string) => {
  try {
    new PublicKey(inputAddress);
    return true;
  } catch (error) {
    return false;
  }
};

