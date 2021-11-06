import React from 'react'
import { Input, Form, TextArea } from 'semantic-ui-react'
import Network from '../../controllers/Network'

import './index.css'

function Index({
	name, setName, details, setDetails, extraMetadata, setExtraMetadata, network, setNetwork,
	symbol, setSymbol, sellerFee, setSellerFee, externalURL, setExternalURL, creatorAddress, setCreatorAddress
}) {
	return (
		<div className="container-project" >
			<h2>Project Details</h2>
			<p>General Settings of your Generative NFT project</p>

			<Form.Field className="field">
		      <p className="label" >Project Name</p>
		      <Input value={name} onChange={(e)=>setName(e.target.value)} className="input" />
		    </Form.Field>

		    <Form.Field className="field">
		      <p className="label" >Project Details</p>
		      <Form>
			    <TextArea value={details} onChange={(e)=>setDetails(e.target.value)} />
			  </Form>
		    </Form.Field>

		    <h3>Advanced</h3>
		    <Form.Field className="field">
		      <p className="label" >Extra Metadata</p>
		      <Form>
			    <TextArea value={extraMetadata} onChange={(e)=>setExtraMetadata(e.target.value)} />
			  </Form>
		    </Form.Field>

		    <Network 
		    	network={network} setNetwork={setNetwork} symbol={symbol} setSymbol={setSymbol} sellerFee={sellerFee} setSellerFee={setSellerFee} 
		    	externalURL={externalURL} setExternalURL={setExternalURL} creatorAddress={creatorAddress} setCreatorAddress={setCreatorAddress}
		    />
		</div>
	)
}

export default Index