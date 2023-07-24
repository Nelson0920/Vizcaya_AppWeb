import React from 'react';
import ProductList from '@containers/ProducList';
import Header from '@components/Header';
import Chatbot from '@components/ChatBot';

const Home = (user) => {
	return (
		<>
			<Header usur={user} />
			<ProductList />
			<Chatbot/>
		</>
	);
}

export default Home;
