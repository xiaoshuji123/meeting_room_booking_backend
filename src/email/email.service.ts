import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('email_host'),
      port: this.configService.get('email_port'),
      secure: false,
      auth: {
        user: this.configService.get('email_user'),
        pass: this.configService.get('email_pass'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('email_name'),
        address: this.configService.get('email_user'),
      },
      to,
      subject,
      text,
    });
  }
}
