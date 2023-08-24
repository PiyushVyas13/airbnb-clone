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
import useLoginModal from "@/app/hooks/useLoginModal";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const toggle = useCallback(()=> {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Login to your account!" center />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="password" label="Password" disabled={isLoading} register={register} errors={errors} required type="password"/>
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button label={"Continue with Google"} onClick={() => signIn('google', { redirect: false })} outline icon={FcGoogle}/>
            <Button label={"Continue with GitHub"} onClick={() => signIn('github', { redirect: false })} outline icon={AiFillGithub}/>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex items-center justify-center gap-2">
                    <div>
                        New to Airbnb?
                    </div>
                    <div className="text-neutral-800 cursor-pointer hover:underline" onClick={toggle}>
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    )

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false
        })
            .then((callback) => {
                setIsLoading(false);
                if(callback?.ok) {
                    toast.success('Login successful!');
                    router.refresh()
                    loginModal.onClose()
                }

                if(callback?.error) {
                    toast.error(callback?.error)
                }
            })
            .catch((error) => {
                toast.error('Something went wrong 😔.')
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <Modal disabled={isLoading} isOpen={loginModal.isOpen} title="Login" onClose={loginModal.onClose} onSubmit={handleSubmit(onSubmit)} actionLabel="Continue" body={bodyContent} footer={footerContent}/>

    );
};

export default LoginModal;