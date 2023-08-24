"use client";

import React, {useCallback, useState} from 'react';
import Modal from "@/app/components/modals/Modal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import {FcGoogle} from "react-icons/fc";
import {AiFillGithub} from "react-icons/ai";
import {signIn} from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const toggle = useCallback(()=> {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Airbnb" subtitle="Create an account!" center />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required  />
            <Input id="password" label="Password" disabled={isLoading} register={register} errors={errors} required type="password"/>
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button label={"Continue with Google"} onClick={() => signIn('google')} outline icon={FcGoogle}/>
            <Button label={"Continue with GitHub"} onClick={() => signIn('github')} outline icon={AiFillGithub}/>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex items-center justify-center gap-2">
                    <div>
                        Already have an account?
                    </div>
                    <div className="text-neutral-800 cursor-pointer hover:underline" onClick={toggle}>
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post('/api/register', data)
            .then(() => {
                registerModal.onClose();
                loginModal.onOpen();
            })
            .catch((error)=> {
                toast.error("Something went wrong 😔")
            })
            .finally(() => {setIsLoading(false)})
    }

    return (
        <Modal disabled={isLoading} isOpen={registerModal.isOpen} title="Register" onClose={registerModal.onClose} onSubmit={handleSubmit(onSubmit)} actionLabel="Continue" body={bodyContent} footer={footerContent}/>

    );
};

export default RegisterModal;