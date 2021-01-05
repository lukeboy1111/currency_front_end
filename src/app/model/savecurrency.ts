import { Deserializable } from './deserializable.model';

export class SaveCurrency implements Deserializable {
    currency: string;    
    rate: number;
    amount: number;
    calculatedAmount?: number;
    source: string;
    comment: string;
    sourceCurrency: string;
    dateOfEntry: string;  

    deserialize(input: any): this {
      return Object.assign(this, input);
    }

  }