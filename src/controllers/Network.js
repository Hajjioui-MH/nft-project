import React from 'react'
import { Form, Checkbox, Grid, Input } from 'semantic-ui-react'
import { networkChoice } from '../constants'

function Network({
	network, setNetwork, symbol, setSymbol, sellerFee, setSellerFee, 
	externalURL, setExternalURL, creatorAddress, setCreatorAddress
}) {
	return (
		<Form>
        <Form.Field>
          <p className="label" >Network:</p>
        </Form.Field>
		<Grid columns='equal' style={{width: '250px'}}>
		    <Grid.Row>
		      <Grid.Column>
		        <Form.Field>
		          <Checkbox
		          	className="checkbox"
		            radio
		            label='Ethereum'
		            name='ethereum'
		            value={networkChoice.Ethereum}
		            checked={network === networkChoice.Ethereum}
		            onChange={()=> setNetwork(networkChoice.Ethereum)}
		          />
		        </Form.Field>
		      </Grid.Column>
		      {/*-------------------*/}
		      <Grid.Column>
		        <Form.Field>
		          <Checkbox
		          	className="checkbox"
		            radio
		            label='Solana'
		            name='solana'
		            value={networkChoice.Solana}
		            checked={network === networkChoice.Solana}
		            onChange={()=> setNetwork(networkChoice.Solana)}
		          />
		        </Form.Field>
		      </Grid.Column>
		    </Grid.Row>
		</Grid>
	  {network === networkChoice.Solana && (
	  	<Grid columns='equal'>
		    <Grid.Row>
		    	<Grid.Column>
			        <Form.Field className="field">
				      <p className="label" >Symbol</p>
				      <Input value={symbol} onChange={(e)=>setSymbol(e.target.value)} className="input" />
				    </Form.Field>
		        </Grid.Column>
		        <Grid.Column>
			        <Form.Field className="field">
				      <p className="label" >Seller Fee Basis Points</p>
				      <Input value={sellerFee} onChange={(e)=>setSellerFee(e.target.value)} className="input" />
				    </Form.Field>
		        </Grid.Column>
		    </Grid.Row>
		    <Grid.Row>
		    	<Grid.Column>
			        <Form.Field className="field">
				      <p className="label" >External URL</p>
				      <Input value={externalURL} onChange={(e)=>setExternalURL(e.target.value)} className="input" />
				    </Form.Field>
		        </Grid.Column>
		        <Grid.Column>
			        <Form.Field className="field">
				      <p className="label" >Creator Address</p>
				      <Input value={creatorAddress} onChange={(e)=>setCreatorAddress(e.target.value)} className="input" />
				    </Form.Field>
		        </Grid.Column>
		    </Grid.Row>
	    </Grid>)
	  }
		</Form>
	)
}

export default Network