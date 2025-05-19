import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { PaymentType } from 'src/enums/payment_type.enum';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsEnum(PaymentType)
  type: PaymentType;

  @IsNumber()
  amount: number;
}
