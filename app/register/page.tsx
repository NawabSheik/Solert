'use client'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsGoogle } from 'react-icons/bs'
import Alert from '@mui/material/Alert';  
import { Button } from '@nextui-org/react'


const Register : React.FC = () =>  {
    const [name, setName]  = useState<string>('') 
    const [email, setEmail]  = useState<string>('') 
    const [password, setPassword] = useState<string>('')
    const [showAlert, setShowAlert] = useState(false);
    const { data } = useSession();
    console.log(data, "is data")
    const [isUser, setIsUser] = useState(false)
    const router = useRouter()


    useEffect(() => {
        if (data?.user) {
            setIsUser(true);
        }
    }, [data?.user])

    if (isUser) {
        router.push('/')
    }

    const submitData = async () => {
        try {
            const response = await axios.post('https://solert.mach-india.com/api/v1/users/register', { name, email, password })
            console.log(response)
            router.push('/login')
        } catch (error) {
            setName('');
            setEmail('');
            setPassword('');
            setShowAlert(true);  // Show the alert

            setTimeout(() => {
                setShowAlert(false);  // Hide the alert after 4 seconds
            }, 4000);
            router.push('/')

            console.log("Error:", error);

        }
    }



    return (
        <div className='flex flex-col justify-center  bg-black h-screen'>
            <div className='flex justify-center'>
                <div className='shadow rounded-xl rounded-tr-none px-16 py-10 login-block'>
                    <h1 className='text-center text-2xl mb-4'>Register</h1>

                    {/* Conditionally render the alert */}

                     {showAlert && (
                        <Alert severity="warning" className='mt-10 mb-10' onClose={() => setShowAlert(false)}>
                            User Already Exists
                        </Alert>
                    )}     

                    <div className='flex flex-col gap-3'>
                        <input
                            type="text"
                            className='p-2 border border-gray-300 rounded-lg outline-none text-slate-500'
                            placeholder='Name'

                            onChange={(e) => {
                                e.preventDefault();
                                setName(e.target.value);
                            }}
                        />
                        <input
                            type="text"
                            className='p-2 border border-gray-300 rounded-lg outline-none text-slate-500'
                            placeholder='Email'
                            onChange={(e) => {
                                e.preventDefault();
                                setEmail(e.target.value);
                            }}
                        />
                        <input
                            type="password"
                            className='p-2 border text-gray-600 border-gray-3x00 rounded-lg outline-none'
                            placeholder='Password'
                            onChange={(e) => {
                                e.preventDefault();
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className='flex justify-center items-center my-6'>
                        <button className='login-block text-white rounded-lg px-4 py-2 w-full font-semibold text-lg  ' type='button' onClick={submitData} >Submit</button>
                    </div>
                    <hr />
                    <p className='my-4 '>Already have an Account? <Link href={'/login'} className='font-bold hover:underline '>Login</Link></p>
             
                       


                </div>
            </div>
        </div>
    )
}

export default Register

 
