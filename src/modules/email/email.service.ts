import { Injectable } from '@nestjs/common';
// import { templates } from './template';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(email) {
    if (process.env.SENDGRID_API_KEY) {
      await SendGrid.send(email);
    } else if (process.env.NODE_ENV === 'production')
      throw new Error('process.env.SENDGRID_API_KEY is undefined!');
    // tslint:disable-next-line:no-console
    else console.warn('process.env.SENDGRID_API_KEY is undefined!');
  }

  async sendContactForm(
    // emailContent: string,
    // emailDescription: string,
    link: string,
    to: string,
  ) {
    // const email = templates.registerCompanyEmail(
    //   to,
    //   process.env.SENDGRID_FROM_EMAIL,
    //   emailDescription,
    //   emailContent,
    // );
    const email = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Baller',
      },
      template_id: 'd-e87c2797959b4c519a73e30c7a3073e1',
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          dynamic_template_data: { button_link: link },
          substitutions: {
            '%button_link%': link,
          },
        },
      ],
    };

    await this.send(email);
  }
}
