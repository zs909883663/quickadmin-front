// +----------------------------------------------------------------------
// | quickadmin框架 [ quickadmin框架 ]
// +----------------------------------------------------------------------
// | 版权所有 2020~2022 南京新思汇网络科技有限公司
// +----------------------------------------------------------------------
// | 官方网站: https://www.quickadmin.icu
// +----------------------------------------------------------------------
// | Author: mj <931982149@qq.com>
// +----------------------------------------------------------------------
// | Description:
// +----------------------------------------------------------------------

import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD7d5+q0he3LZzAr+vql2zOgf/0\n' +
    '/me2Pyi3oksjFV6+MMxbA95rIKt66QMA5TWwRyv7m+Cx1Xi1/HChjHtQmcZlgkNI\n' +
    '4IjxbnJUl4kQXcpLMC0dbK9S1CRR1bmNdxpG0mgP3cThMxgd7UYMg80WfrEK29K0\n' +
    'iCVo7PU8cdaA/w6kXwIDAQAB'

const privateKey =
    'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAPt3n6rSF7ctnMCv\n' +
    '6+qXbM6B//T+Z7Y/KLeiSyMVXr4wzFsD3msgq3rpAwDlNbBHK/ub4LHVeLX8cKGM\n' +
    'e1CZxmWCQ0jgiPFuclSXiRBdykswLR1sr1LUJFHVuY13GkbSaA/dxOEzGB3tRgyD\n' +
    'zRZ+sQrb0rSIJWjs9Txx1oD/DqRfAgMBAAECgYACIyEjRYfYEbYsWRJrOwA8vRQc\n' +
    '0/CzttO0w9dZo/vbJ/UErQK97FgowkQ5RLlxFxnDmK6PNF5DRbL7XINLyxLJk8K7\n' +
    'R3U3zdqwpyuZ37oQfbpLZtTuUwLb5znAd6xoKwr/vuKMfNielNwTuX/nijZFvHTX\n' +
    'n8nteVxU7Z5gr7BQyQJBAP9KYRuSiTCgJIIamwY19eHUyjqfXrVsGxI0NjMl1bM0\n' +
    'DrgjSF/DqGQn22QnWvE3y5GbXY6M5sfEMfO8fiEXcnUCQQD8KoY+/S5MTSD7HgHU\n' +
    'ns3RblOY3Gf3kaV9XB4UNrKjfhkZi9MDiglO57Cg94YvV0KhvCDpQYWwiof8z9/o\n' +
    'E3kDAkAnoqWnAT45hXOFm5ncAf613DK1nU63/hvJ3L9Ze5NNKlTqs9elvpvjSOjg\n' +
    'CNguwUnixmtlGW0vML/MpsQyYRCNAkAeoafHFQg/uorMFlwQkO3dh/JdukBi4W1h\n' +
    '6gO5Xt+aXqH76XFLl8QDsr9Q/mBtdcMhVHIHA6+Sv3E/c5z2Ww8zAkEA5uuYtPD+\n' +
    '4wmFwy4BOrrl7yCMMem6uXFLLDlCDwP524gmAR5osoIIQQsHcr4JtC1FCkXqKJ56\n' +
    'YxKK4use8I1haw=='

// 加密
export function encrypt (txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt (txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey) // 设置私钥
    return encryptor.decrypt(txt) // 对数据进行解密
}
