import React from 'react';
import './App.css';

import { RichTextEditor } from "@sensenet/controls-react";


const App: React.FC = () => {
	return (
		<div className="App">
			<RichTextEditor settings={{
				Name: 'James',
				DisplayName: 'Jamie',
				Compulsory: true,
				ReadOnly: false,
				DefaultValue: 'Dis some text',
				Type: 'THE! Type',
				FieldClassName: 'johnny'
			}} actionName={'edit'}/>

		</div>
	);
}

export default App;
