import Link from 'next/link'
import React from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import Image from 'next/image'

export const Footer = () => {
  return (
    <div className=' text-white py-8 footer'>
        <div className='max-w-screen-xl mx-auto '>
            <div className='flex justify-between'>
                <div className='pb-4 '>
                <Image
                src="/solert.png" alt="logo" width="100" height="100"/>
                    <div className='px-1 py-2'>
                        <h3 className='text-xl font-semibold'>Developed By</h3>
                        <div className='flex items-center gap-2 pt-2'>
                            <Link href={'https://x.com/priyanshuu_eth'}><FaXTwitter size={30}/></Link>
                            <p>Priyanshu Tiwari</p>
                           
                        </div>
                        <div className='flex items-center gap-2 pt-2 mt-2'>
                            <Link href={'https://x.com/iam_anawab'}><FaXTwitter size={30}/></Link>
                            <p>Nawab Sheikh</p>
                           
                        </div>
                        
                    </div>
                </div>
                {/* <div className='flex gap-16 mb-3'>
                    <div>
                        <h3 className='text-xl font-semibold mb-4' >Products</h3>
                       <Link href="/trackAccount">
                        <p>Dcex Activity</p>
                        </Link> 
                    </div>
                   
                  
                </div> */}
            </div>

            <hr />

            <div className='pt-4 text-center'>
                <span>&copy;2024 Solert. All Rights Reserved.</span>
            </div>
        </div>
    </div>
  )
}
