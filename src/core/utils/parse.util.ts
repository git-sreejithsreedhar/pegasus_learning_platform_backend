import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JsonBodyPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const body = value as Record<string, unknown>;

    Object.keys(body).forEach((key) => {
      const val = body[key];

      if (
        typeof val === 'string' &&
        (val.startsWith('{') || val.startsWith('['))
      ) {
        try {
          body[key] = JSON.parse(val) as unknown;
        } catch {
          // ignore invalid JSON
        }
      }
    });

    return body;
  }
}
// import { Injectable, PipeTransform } from '@nestjs/common';

// @Injectable()
// export class JsonBodyPipe implements PipeTransform {
//   transform(value: any) {

//     // ✅ prevent crash for GET requests or empty body
//     if (!value || typeof value !== 'object') {
//       return value;
//     }

//     Object.keys(value).forEach((key) => {
//       const val = value[key];

//       if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
//         try {
//           value[key] = JSON.parse(val);
//         } catch {
//           // ignore invalid JSON
//         }
//       }
//     });

//     return value;
//   }
// }
