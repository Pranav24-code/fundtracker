import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../components/seo';
import './index.scss';

if (typeof window !== 'undefined') {
  require('bootstrap/dist/js/bootstrap');
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SEO font={'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'} />
      <Provider store={store}>
        <AuthProvider>
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </AuthProvider>
      </Provider>
    </>
  );
}

export default MyApp;
