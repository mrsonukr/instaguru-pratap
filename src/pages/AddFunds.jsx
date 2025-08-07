import React from 'react';
import PaymentForm from '../components/ui/PaymentForm';
import Header from '../components/Header';


const AddFunds = () => {
    return (
        <div>
            <Header/>
            <div className='mt-20'></div>
            <PaymentForm />
        </div>
    );
}

export default AddFunds;
