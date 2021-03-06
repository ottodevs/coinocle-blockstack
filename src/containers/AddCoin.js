import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CoinHoldingAdd from '../components/CoinHoldingAdd';
import {updateHoldings} from '../modules/account';
import {loadCoin, loadCoinChartData, clearChart, loadOrderBook} from '../modules/coin';
import {updateHoldingInput} from '../modules/ui';
import {formatMoney} from '../utils';

class AddCoin extends React.Component {
  static PropTypes = {}

  componentDidMount() {
    this.props.loadCoin(this.props.match.params.coin, this.props.currency);
  }

  signin() {
    const blockstack = window.blockstack;
    blockstack.redirectToSignIn();
  }

  render() {

    const props = this.props;
    const coin = props.coin;
    const holdings = props.holdings;
    const amount = !!coin && coin.id && holdings && holdings[coin.id] ? holdings[coin.id] : 0;
    const currency = this.props.currency;
    const price = coin['price_' + currency.toLowerCase()];
    const value_in_currency = !!amount ? amount * price : 0;

    return (
      <div className="addcoin">
        <h2 className="text-center">{coin.name}</h2>
        <h3>{coin.symbol}</h3>
        <h2>{formatMoney(currency, value_in_currency)}
          <small className="text-center"><br/>Your Current Holdings</small>
        </h2>

        <h3>Enter total {coin.name} owned</h3>
        <CoinHoldingAdd
            coin={coin}
            value={amount}
            holdingInput={this.props.holdingInput}
            updateHoldingInput={this.props.updateHoldingInput}
            onSave={this.props.updateHoldings}
            user={this.props.user}
            signin={this.signin}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  coin: state.coin.selected,
  holdings: state.account.holdings,
  holdingInput: state.ui.holdingInput,
  currency: state.coin.currency,
  user: state.account.user,
  coinChartData: state.coin.chartData,
  orderBookData: state.coin.orderBookData,
  priceChartError: state.coin.priceChartError,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadCoin,
  loadCoinChartData,
  loadOrderBook,
  updateHoldings,
  updateHoldingInput,
  clearChart,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddCoin)
