import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from 'src/enums/payment_type.enum';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'b4e1f33e-9dfc-4a4c-96cd-663b3b6e24cb',
    description: 'ID del pedido al que se asocia este pago',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.QR,
    description: 'Tipo de pago: qr, efectivo o transferencia',
  })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    example: 150.75,
    description: 'Monto pagado por el cliente',
  })
  @IsNumber()
  amount: number;
}
