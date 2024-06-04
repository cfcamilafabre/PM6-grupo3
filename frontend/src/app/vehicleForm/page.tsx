'use client'
import validate from "@/helpers/validate";
import { useEffect, useState } from "react";
import IVehicleData from "../../interfaces/IVehicleData";
import IErrorsVehicleForm from "../../interfaces/IErrorsVehicleForm";
import axios from 'axios';
import { redirect, useRouter } from "next/navigation";


const VehicleForm = () => {

    const [token, setToken] = useState();
    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
          const userToken = localStorage.getItem('userSession');
          setToken(JSON.parse(userToken!))
          !userToken && redirect("/login")
        }
      }, [])
      
    const router = useRouter();

    const [userSession, setUserSession] = useState()
    const [errors, setErrors] = useState<IErrorsVehicleForm>({});
    const [vehicleData, setVehicleData] = useState<IVehicleData>({
        title: '',
        description: '',
        price: 0,
        color: '',
        model: '',
        file: null,
        brand: '',
        year: 0,
        mileage: '',
    })
    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const token = localStorage.getItem("userSession");
            if (token) {
                const parsedSession = JSON.parse(token);
                setUserSession(parsedSession.token);
            }
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === "file") {
            setVehicleData(prevData => ({
                ...prevData,
                [name]: files
            }));
        } else {
            setVehicleData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: value.trim() === '' ? 'Este campo es requerido' : ''
        }));
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: value.trim() === '' ? 'Este campo es requerido' : ''
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        const validationErrors = validate(vehicleData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const formData = new FormData();
            formData.append("title", vehicleData.title);
            formData.append("description", vehicleData.description);
            formData.append("price", vehicleData.price.toString());
            formData.append("color", vehicleData.color);
            formData.append("model", vehicleData.model);
            formData.append("brand", vehicleData.brand);
            formData.append("year", vehicleData.year.toString());
            formData.append("mileage", vehicleData.mileage);

            if (vehicleData.file) {
                Array.from(vehicleData.file).forEach(file => {
                    formData.append("file", file);
                });
            }

            try {
                const response = await axios.post('http://localhost:3001/posts', formData, {
                    headers: {
                        Authorization: `Bearer ${userSession}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    alert('El vehículo se ha publicado correctamente');
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Error al publicar el vehículo:', error);
                alert('Hubo un error al intentar publicar el vehículo.');
            }
        }
    }


    return (
        <div className="bg-gradient-to-bl from-[#222222] to-[#313139]  font-sans text-white">
            <div className="flex flex-col gap-2 p-4 items-center">
                <h1 className=" text-4xl font-semibold mt-6">¡Publica tu vehículo ahora!</h1>
                <span className="text-xl">Rápido, sencillo, y gratuito.</span>
            </div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 flex-wrap bg-[#222222] rounded">
                <div className="block mb-4">
                    <label className=" text-slate-50">Título</label>
                    <input
                        name="title"
                        type="text"
                        value={vehicleData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                    />
                    {errors.title && <span className="text-red-500">{errors.title}</span>}
                </div>
                <div className="block mb-4">
                    <label className=" text-slate-50">Descripción</label>
                    <textarea
                        name='description'
                        value={vehicleData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                    />
                    {errors.description && <span className="text-red-500">{errors.description}</span>}
                </div>
                <div className="flex gap-8">
                    <div className="mb-4">
                        <label className="text-slate-50">Valor</label>
                        <input
                            name='price'
                            type="number"
                            value={vehicleData.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                        />
                        {errors.price && <span className="text-red-500">{errors.price}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="text-slate-50">Marca</label>
                        <input
                            name='brand'
                            type="text"
                            value={vehicleData.brand}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                        />
                        {errors.brand && <span className="text-red-500">{errors.brand}</span>}
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="mb-4">
                        <label className="text-slate-50">Color</label>
                        <input
                            name='color'
                            type="text"
                            value={vehicleData.color}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                        />
                        {errors.color && <span className="text-red-500">{errors.color}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="text-slate-50">Modelo</label>
                        <input
                            name='model'
                            type="text"
                            value={vehicleData.model}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                        />
                        {errors.model && <span className="text-red-500">{errors.model}</span>}
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="mb-4 w-1/2">
                        <label className="text-slate-50">Año</label>
                        <input
                            name='year'
                            type="number"
                            value={vehicleData.year}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                        />
                        {errors.year && <span className="text-red-500">{errors.year}</span>}
                    </div>
                    <div className="mb-4 w-1/2">
                        <label className="text-slate-50">Kilometraje</label>
                        <input
                            name='mileage'
                            type="text"
                            value={vehicleData.mileage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="w-full px-3 mt-3 py-2 border rounded text-[#222222]"
                        />
                        {errors.mileage && <span className="text-red-500">{errors.mileage}</span>}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="text-slate-50">Fotos</label>
                    <input
                        name='file'
                        type="file"
                        accept="image/*"
                        multiple
                        className="w-full px-3 mt-3 py-4 border rounded text-slate-50"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.image && <span className="text-red-500">{errors.image}</span>}
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="mb-6 w-32 items-center bg-[#C4FF0D] text-[#222222] py-2 rounded">
                        Publicar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VehicleForm;

