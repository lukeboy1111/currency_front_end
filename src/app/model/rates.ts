import { Deserializable } from './deserializable.model';

export class Rates implements Deserializable {
    id?: string;
    currency: string;    
    rate: number;
  
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