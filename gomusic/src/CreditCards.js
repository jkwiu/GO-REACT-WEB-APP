import React from 'react';
import {
  injectStripe,
  StripeProvider,
  Elements,
  CardElement,
} from 'reactstripe-elements';

const INITAILSTATE = 'INITIAL',
  SUCCESSSTATE = 'COMPLETE',
  FAILEDSTATE = 'FAILED';

class CreditCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: INITAILSTATE,
    };
  }
  renderCreditCardInformation() {
    const style = {
      base: {
        fontSize: '20px',
        color: '#495057',
        fontFamily:
          'apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
      },
    };

    const usersavedcard = (
      <div>
        <div className="form-row text-center">
          <button
            type="button"
            className="btn btn-outline-success text-center mx-auto"
          >
            Use saved card?
          </button>
        </div>
        <hr />
      </div>
    );

    const remembercardcheck = (
      <div className="form-row form-check textcenter">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="remembercardcheck"
        />
        <label className="form-check-label" htmlFor="remembercardcheck">
          Remember Card?
        </label>
      </div>
    );

    return (
      <div>
        {usersavedcard}
        <h5 className="mb-4">Payment Info</h5>
        <form onSubmit={this.handleSubmit}>
          <div className="form-row">
            <div className="col-lg-12 form-group">
              <label htmlFor="cc-name">Name On Card:</label>
              <input
                id="cc-name"
                name="cc-name"
                className="form-control"
                placeholder="Name on Card"
                onChange={this.handleInputChange}
                type="text"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-lg-12 form-group">
              <label htmlFor className="card">
                Card Information:
              </label>
              <CardElement id="card" className="form-control" style={style} />
            </div>
          </div>
          {remembercardcheck}
          <hr className="mb-4" />
          <button type="submit" className="btn btn-success btnlarge">
            {this.props.operation}
          </button>
        </form>
      </div>
    );
  }
  renderSuccess() {
    return (
      <div>
        <h5 className="mb-4 text-success">Request Successful....</h5>
        <button
          type="submit"
          className="btn btn-success btn-large"
          onClick={() => {
            this.props.toggle();
          }}
        >
          Ok
        </button>
      </div>
    );
  }
  renderFailure() {
    return (
      <div>
        <h5 className="mb-4 text-danger">
          Credit card information invalid, try again or exit
        </h5>
        {this.renderCreditCardInformation()}
      </div>
    );
  }
  async handleSubmit(event) {
    event.preventDefault();
    console.log('Handle submit called, with name: ' + this.state.value);
    let { token } = await this.props.stripe.createToken({
      name: this.state.value,
    });
    if (token == null) {
      console.log('invalid token');
      this.setState({ status: FAILEDSTATE });
      return;
    }
    let response = await fetch('/charge', {
      method: 'POST',
      headers: { 'Content-type': 'text/plain' },
      body: JSON.stringify({
        token: token.id,
        operation: this.props.operation,
      }),
    });
    console.log(response.ok);
    if (response.ok) {
      console.log('Purchase Complete!');
      this.setState({ status: SUCCESSSTATE });
    }
  }
  handleInputChange(event) {
    this.setState({
      value: event.target.value,
    });
  }
  render() {
    let body = null;
    switch (this.state.status) {
      case SUCCESSSTATE:
        body = this.renderSuccess();
        break;
      case FAILEDSTATE:
        body = this.renderFailure();
        break;
      default:
        body = this.renderCreditCardInformation();
    }
    return <div>{body}</div>;
  }
}
