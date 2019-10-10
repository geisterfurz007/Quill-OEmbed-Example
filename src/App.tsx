import React from 'react';
import './App.css';

import { RichTextEditor } from "@sensenet/controls-react";
import QuillOEmbedModule from './QuillOEmbedModule';

import { Quill } from 'react-quill';

Quill.register('modules/oembed', QuillOEmbedModule);

const App: React.FC = () => {
	return (
		<div className="App">
			<RichTextEditor settings={{
				Name: 'Some name',
				DisplayName: 'Some Displayname',
				Compulsory: true,
				ReadOnly: false,
				DefaultValue: 'Some text',
				Type: 'Some Type',
				FieldClassName: 'some-class-name'
			}} actionName={'edit'}/>

		</div>
	);
}

export default App;
