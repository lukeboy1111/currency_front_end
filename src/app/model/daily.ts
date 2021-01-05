import { Deserializable } from './deserializable.model';
import { Rates } from 'src/app/model/rates';
import { Currency } from 'src/app/model/currency';

export class Daily implements Deserializable {
  theDate: string;
  rates: Currency[] = [];

  deserialize(input: any): this {
    // Assign input to our object BEFORE deserialize our object to prevent already deserialized objects from being overwritten.
    Object.assign(this, input);
    // Iterate over all listCurrencies for our user and map them to a proper `Rates` model
    this.rates = input.listCurrencies.map(rates => new Currency().deserialize(rates));
    return this;
  }

  getRates() {
    return this.rates;
  }
}