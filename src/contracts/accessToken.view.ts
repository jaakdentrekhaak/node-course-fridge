import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class AccessTokenView {
  @Expose()
  @IsString()
  public token: string;

  @Expose()
  @IsString()
  public expiresIn: string;
}
