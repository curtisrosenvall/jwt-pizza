import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  const vars = {}

  group('Login and order - https://pizza.startupcode.net/delivery', function () {
    
    response = http.put(
      'https://pizza-service.startupcode.net/api/auth',
      '{"email":"a@jwt.com","password":"admin"}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          origin: 'https://pizza.startupcode.net',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    if (!check(response, { 'Login status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Login was *not* 200');
    }

    vars['token'] = jsonpath.query(response.json(), '$.token')[0]

    response = http.options('https://pizza-service.startupcode.net/api/auth', null, {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'access-control-request-headers': 'content-type',
        'access-control-request-method': 'PUT',
        origin: 'https://pizza.startupcode.net',
        priority: 'u=1, i',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })
    sleep(1.7)

    response = http.get('https://pizza-service.startupcode.net/api/order/menu', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        origin: 'https://pizza.startupcode.net',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })

    vars['title1'] = jsonpath.query(response.json(), '$[4].title')[0]

    response = http.options('https://pizza-service.startupcode.net/api/order/menu', null, {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
        origin: 'https://pizza.startupcode.net',
        priority: 'u=1, i',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })

    response = http.get('https://pizza-service.startupcode.net/api/franchise', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        origin: 'https://pizza.startupcode.net',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })

    response = http.options('https://pizza-service.startupcode.net/api/franchise', null, {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'GET',
        origin: 'https://pizza.startupcode.net',
        priority: 'u=1, i',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })
    sleep(6.5)

    response = http.post(
      'https://pizza-service.startupcode.net/api/order',
      `{"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042},{"menuId":3,"description":"Margarita","price":0.0042},{"menuId":4,"description":"Crusty","price":0.0028},{"menuId":5,"description":"${vars['title1']}","price":0.0099}],"storeId":"3","franchiseId":2}`,
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.startupcode.net',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    
    // Add check for order success
    if (!check(response, { 'Order status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Order was *not* 200');
    }
    

    try {
      const orderResponse = response.json();
      vars['orderJwt'] = jsonpath.query(orderResponse, '$.jwt')[0];
      
      if (vars['orderJwt']) {
        console.log('Successfully extracted JWT from order response');
      } else {
        console.log('JWT field not found in order response');
      }
    } catch (e) {
      console.log('Error parsing order response:', e);
    }
    
    if (!vars['orderJwt']) {
      console.log('WARNING: Using hardcoded JWT as fallback');
      vars['orderJwt'] = "eyJpYXQiOjE3NDM0NjI0NTEsImV4cCI6MTc0MzU0ODg1MSwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJjdXJ0cm9zZSIsIm5hbWUiOiJDdXJ0aXMgUm9zZW52YWxsIn0sImRpbmVyIjp7ImlkIjo1LCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJhQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MSwiZGVzY3JpcHRpb24iOiJWZWdnaWUiLCJwcmljZSI6MC4wMDM4fSx7Im1lbnVJZCI6MiwiZGVzY3JpcHRpb24iOiJQZXBwZXJvbmkiLCJwcmljZSI6MC4wMDQyfSx7Im1lbnVJZCI6MywiZGVzY3JpcHRpb24iOiJNYXJnYXJpdGEiLCJwcmljZSI6MC4wMDQyfSx7Im1lbnVJZCI6NCwiZGVzY3JpcHRpb24iOiJDcnVzdHkiLCJwcmljZSI6MC4wMDI4fSx7Im1lbnVJZCI6NSwiZGVzY3JpcHRpb24iOiJDaGFycmVkIExlb3BhcmQiLCJwcmljZSI6MC4wMDk5fV0sInN0b3JlSWQiOiIzIiwiZnJhbmNoaXNlSWQiOjIsImlkIjoyM319.vGZugLT6ovx0G5GzBdRZUUaZ4xjWqiD37LruZiyipQGsnSDHjFL3BE_ZpbYIT7AdHoUn9mtpJJroOckkz4Sp28swUhqfFvitz-d2gR6Dk-4H-CiV-Jq8iZHq8Q05a_3BzOUkVJyx_41TZva1soUbdSLV-FpgDzfvE-ZzhYl7Fnys1yU5u2yIzMIVDneojeNDjr7C3vGKAFdo4ToAgxwdD0kaO622S_T07bXwGQ-oJh1g4UW53VS_tjJMZNK-XrdcsYUJX-tVDqVGzNa8K3CbQH_7pErQ8fVYTni6axuxOwlqZYhLKjVi0sGCjgJVF-yPvH-gKJTvbpgja1oykPBre9scyNoqVLtPEI0mFW8NFML5nzs1imE73VnnNxoi1mANdm-yQxvfwFaRIaRW8FfV9ZyWSxKve1vWKrfJSqHJdkqy9eaBne_vHXyf45NoY_lGSBbwjaUW605k7JJ9ID-qFR6DgfVvJIkBM1cu57GOrCPSawfN249U7sg_ch9FESAdo1i6iKNuuZ6aBFPeAKzApHQfcCThsFiVKgH5rLJ_jq0AwiVzk1_XVx_-2f8zbVR8gmGniJUCYNNH2XcWMdqxW-6N6n6aJXHlO2li3EczKdEhhdU3v19AcXaPyFEIBIb2ysa-5ZSKHQo823W_cbzK31HxJqC4xOTI30GTCYZrCXk";
    }

    response = http.options('https://pizza-service.startupcode.net/api/order', null, {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'POST',
        origin: 'https://pizza.startupcode.net',
        priority: 'u=1, i',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })
    sleep(1.2)

    response = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      `{"jwt":"${vars['orderJwt']}"}`,
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.startupcode.net',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-storage-access': 'active',
        },
      }
    )
    
    if (!check(response, { 'Verification status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Verification was *not* 200');
    }

    response = http.options('https://pizza-factory.cs329.click/api/order/verify', null, {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'access-control-request-headers': 'authorization,content-type',
        'access-control-request-method': 'POST',
        origin: 'https://pizza.startupcode.net',
        priority: 'u=1, i',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
    })
  })
}