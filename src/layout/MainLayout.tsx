import React from 'react'
import Header from './Header'
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import Footer from './Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const headerVisible = useSelector(
        (state: RootState) => state.user.layoutSettings.headerVisible
    );

    return (
        <div className="w-full h-screen flex flex-col">
            {headerVisible && <Header />}
            {headerVisible ?
                <div className="w-full flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    {children}
                </div> : <div>{children}</div>
            }
            {headerVisible && <Footer />}
        </div>
    )
}

export default MainLayout;