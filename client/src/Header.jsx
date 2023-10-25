import React from 'react';

export default function Header() {

    return (
        <header className="header">
            <div className="logo-container">
                
                <a href="/">
                    <img src="/src/assets/logo.svg" alt="logo" className="logo" />
                </a>
            </div>
            <p className='copyright'>&copy; {new Date().getFullYear()} 
                <a href='https://github.com/donpipon'> donpipon</a>
            </p>
        </header>
    );
};