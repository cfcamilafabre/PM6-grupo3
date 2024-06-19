"use client"
import CarPostCard from '@/components/admin/CarPostCard';
import OrderStats from '@/components/admin/OrderStats';
import RevenueStats from '@/components/admin/RevenueStats';
import ReviewsAdm from '@/components/admin/ReviewsAdm';
import SidebarAdm from '@/components/admin/SidebarAdm'
import UserStats from '@/components/admin/UserStats';
import UserTable from '@/components/admin/UserTable';
import { IUserData, IUserDataAdm } from '@/interfaces/IUser';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const page = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [userToken, setUserToken] = useState<string | null>(null);
  const router = useRouter();
  const [rol, setRol] = useState<string>('user');
  const apiUrl = process.env.NEXT_PUBLIC_API_GET_USERS_TOKEN;
if (!apiUrl) {
  throw new Error('Environment variable NEXT_PUBLIC_API_GET_USERS_TOKEN is not set');
}
  
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userSession = localStorage.getItem("userSession");
      if (userSession) {
        const parsedSession = JSON.parse(userSession);
        setUserToken(parsedSession.token);
      } 
      else {
        Swal.fire({
          title: "Error de acceso",
          text: "Necesitas estar logueado para ingresar",
          icon: "error"
        });
        redirect("/login")
      }
    }
  }, [router]);
  // useEffect(()=>{
  //   const fetchdata = async ()=>{
  //     try {
  //       const response = await fetch(apiUrl, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error('Error fetching user data');
  //       }
  //       const data = await response.json();
  //       // setRol(data.roles)

  //     } catch (error:any) {
  //       throw new Error(error);}
  //   }
  //   fetchdata()
  // },[])
  
  return (
    <div className="flex min-h-screen">
      <SidebarAdm onSelect={setSelectedSection} />
      <div className="flex-grow bg-gray-100 p-6">
        {selectedSection === 'dashboard' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserStats />
            <RevenueStats />
            <OrderStats />
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <CarPostCard />
            </div>
          </div>
        )}
        {selectedSection === 'users' && <UserTable />}
        {selectedSection === 'reviews' && <ReviewsAdm />}
      </div>
    </div>
  );
};


export default page
