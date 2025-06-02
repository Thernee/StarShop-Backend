import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address format' })
  walletAddress: string;
}
