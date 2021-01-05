import { Deserializable } from './deserializable.model';

export class Currency implements Deserializable {
    id?: string;
    currency: string;    
    rate: number;
    amount?: number;
    calculatedAmount?: number;
    source?: string;
    comment?: string;
    sourceCurrency?: string;
    dateOfEntry?: string;  

    deserialize(input: any): this {
      return Object.assign(this, input);
    }
  
    getId() {
      return this.id;
    }

    getCurrency() {
      return this.currency;
    }

    getRate() {
      return this.rate;
    }
  }