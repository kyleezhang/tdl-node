import { Buffer, Blob } from 'buffer'
import { ReadableStream, WritableStream } from 'stream/web'
import { setTimeout as delay } from 'timers/promises'
import { MessageChannel } from 'worker_threads'
/**
 * 基本使用
 */
// const buf1 = Buffer.alloc(10) // 创建一个长度为 10、且用 0 填充的 Buffer
// const buf2 = Buffer.alloc(10, 1) // 创建一个长度为 10、且用 0x1 填充的 Buffer
// const buf3 = Buffer.allocUnsafe(10) // 创建一个长度为 10、且未初始化的 Buffer。这个方法比调用 Buffer.alloc() 更快，但返回的 Buffer 实例可能包含旧数据，因此需要使用 fill() 或 write() 重写。
// const buf4 = Buffer.from([1, 2, 3]) // 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
// const buf5 = Buffer.from('tést') // 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
// const buf6 = Buffer.from('tést', 'latin1') // 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
// const buf7 = Buffer.from([257, 257.5, -255, 1]) // 创建包含字节 [1, 1, 1, 1] 的缓冲区，所有条目都使用 `(value & 255)` 截断以符合范围 0–255。

/**
 * 将 Buffer 传给 TypedArray 构造函数将复制 Buffer 的内容，解释为整数数组，而不是目标类型的字节序列。
 */
// const buf = Buffer.from([1, 2, 3, 4])
// const unit32Array = new Uint32Array(buf)
// console.log(unit32Array) // Uint32Array(4) [ 1, 2, 3, 4 ]

/**
 * ArrayBuffer 是 TypedArray 的数据源, TypedArray 是 ArrayBuffer 的视图. 多个 TypedArray 可以共享同一个 ArrayBuffer
 */
// const arrayBuffer: ArrayBuffer = new ArrayBuffer(4)
// const unitArray = new Uint8Array(arrayBuffer)
// const intArray = new Int8Array(arrayBuffer)
// console.log(unitArray.buffer === intArray.buffer) // true
// unitArray.set([0, 1, 2, 3])
// console.log(intArray) // Int8Array(4) [ 0, 1, 2, 3 ]
// intArray[1] = -1
// console.log(unitArray) // Uint8Array(4) [ 0, 255, 2, 3 ]

/**
 * 以 ArrayBuffer 为数据源创建 Buffer，两者共享同一内存
 */
// const arr2 = [0, 1, 2, 3]
// const int32Array = new Int32Array(arr2)
// const arrBuffer = int32Array.buffer
// const buf1 = Buffer.from(arrBuffer)
// buf1[0] = 1
// console.log(int32Array) // Int32Array(4) [ 1, 1, 2, 3 ]

// const buf2 = Buffer.from('hello', 'utf16le')
// const unit16Array = new Uint16Array(buf2.buffer, buf2.byteOffset, buf2.length / Uint16Array.BYTES_PER_ELEMENT)
// console.log(unit16Array) // Uint16Array(5) [ 104, 101, 108, 108, 111 ]
// buf2[0] = 1
// console.log(unit16Array) // Uint16Array(5) [ 1, 101, 108, 108, 111 ]

/**
 * 以 TypedArray 为数据源会复制 TypedArray 的内容
 */
// const arr = new Uint16Array(2);
// arr[0] = 5000;
// arr[1] = 4000;
// const buf1 = Buffer.from(arr); // 复制 arr 的内容
// const buf2 = Buffer.from(arr.buffer) // 与 arr 共享内存
// console.log(buf1) // <Buffer 88 a0> 相当于 Buffer.from([5000, 4000])
// console.log(buf2) // <Buffer 88 13 a0 0f>
// console.log(arr.buffer) // ArrayBuffer { [Uint8Contents]: <88 13 a0 0f>, byteLength: 4 }
// arr[1] = 6000
// console.log(buf1) // <Buffer 88 a0>
// console.log(buf2) // <Buffer 88 13 70 17>

/**
 * Blob 封装了不可变的原始数据，可以在多个线程间安全地共享，这儿的数据支持字符串数组、<ArrayBuffer>、<TypedArray>、<DataView> 或 <Blob> 对象、或此类对象的任何组合
 */
// const arrayBuffer = new ArrayBuffer(16)
// const int32Array = new Int32Array(arrayBuffer)
// const blob1 = new Blob([int32Array])
// blob1.text().then(res => {
//     console.log(res)
// })
// blob1.arrayBuffer().then((res: ArrayBuffer) => {
//     console.log(res) // ArrayBuffer { [Uint8Contents]: <00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>, byteLength: 16 }
// })
// const blob2 = new Blob(['hello world'], {
//     type: 'string',
//     encoding: 'utf-8'
// })
// blob2.text().then(res => {
//     console.log(res) // hello world
// })
// blob2.arrayBuffer().then(res => {
//     console.log(res) // ArrayBuffer { [Uint8Contents]: <68 65 6c 6c 6f 20 77 6f 72 6c 64>, byteLength: 11 }
// })
// const stream = blob2.stream() as ReadableStream
// const writable: WritableStream = new WritableStream({
//     write(chunk) {
//         console.log(chunk) // Uint8Array(11) [ 104, 101, 108, 108, 111,  32, 119, 111, 114, 108, 100]
//     }
// })
// stream.pipeTo(writable) // ReadableStream { locked: false, state: 'readable', supportsBYOB: false }

/**
 * 一旦创建了 <Blob> 对象，就可以通过 MessagePort 将其发送到多个目的地，而无需传输或立即复制数据。 只有在调用 arrayBuffer() 或 text() 方法时才会复制 Blob 包含的数据。
 */
// const blob = new Blob(['hello there'])
// const mc1 = new MessageChannel()
// const mc2 = new MessageChannel()
// mc1.port1.on('message', async (blob) => {
//     console.log(await blob.arrayBuffer()) // ArrayBuffer { [Uint8Contents]: <68 65 6c 6c 6f 20 74 68 65 72 65>, byteLength: 11 }
//     mc1.port1.close()
// })
// mc2.port1.on('message', async (blob) => {
//     delay(1000)
//     console.log(await blob.arrayBuffer()) // ArrayBuffer { [Uint8Contents]: <68 65 6c 6c 6f 20 74 68 65 72 65>, byteLength: 11 }
//     mc2.port1.close()
// })
// mc1.port2.postMessage(blob)
// mc2.port2.postMessage(blob)
// blob.text().then(console.log) // hello there, 发布后 Blob 仍然可用

/**
 * Buffer.byteLength(string[, encoding])
 * 使用 encoding 编码时返回字符串的字节长度。 这与 String.prototype.length 不同，String.prototype.length 不考虑用于将字符串转换为字节的编码。
 */
// const str = '\u00bd + \u00bc = \u00be'
// console.log(Buffer.from(str, 'utf-8')) // <Buffer c2 bd 20 2b 20 c2 bc 20 3d 20 c2 be>
// console.log(`${str}: ${str.length} characters, ` + `${Buffer.byteLength(str, 'utf8')} bytes`) // ½ + ¼ = ¾: 9 characters, 12 bytes

/**
 * Buffer.compare(buf1, buf2)
 * 比较 buf1 和 buf2，通常用于对 Buffer 实例的数组进行排序。 这相当于调用 buf1.compare(buf2)。
 * 返回-1、0、1
 */
// const buf1 = Buffer.from([1, 6, 7, 8])
// const buf2 = Buffer.from([4, 0, 1, 2])
// console.log(Buffer.compare(buf1, buf2)) // -1，等同于 buf1.compare(buf2)
// console.log([buf1, buf2].sort(Buffer.compare)) // [ <Buffer 01 06 07 08>, <Buffer 04 00 01 02> ]

/**
 * Buffer.concat(list[, totalLength])
 * 返回新的 Buffer，它是将 list 中的所有 Buffer 实例连接在一起的结果。
 * 如果列表没有条目，或者 totalLength 为 0，则返回新的零长度 Buffer。
 * 如果未提供 totalLength，则从 list 中的 Buffer 实例通过相加其长度来计算。
 * 如果提供了 totalLength，则将其强制为无符号整数。 如果 list 中 Buffer 的组合长度超过 totalLength，则结果截断为 totalLength，如果组合长度小于 totalLength 则会用 0 来填充
 */
// const buf1 = Buffer.alloc(5)
// const buf2 = Buffer.allocUnsafe(3)
// const buf3 = Buffer.concat([buf1, buf2], 10)
// console.log(buf3) // <Buffer 00 00 00 00 00 00 00 00 00 00>

/**
 * buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
 * 将数据从 buf 的区域复制到 target 的区域，即使 target 内存区域与 buf 重叠。
 * TypedArray.prototype.set() 执行相同的操作，可用于所有 TypedArray，包括 Node.js Buffer，尽管它采用不同的函数参数。
 */
const buf1 = Buffer.allocUnsafe(26)
const buf2 = Buffer.allocUnsafe(26).fill('!')
for (let i = 0; i < 26; i++) {
    buf1[i] = 97 + i
}
buf1.copy(buf2, 8, 16, 20) // 将 `buf1` 字节 16 到 19 复制到 `buf2` 中，从 `buf2` 的字节 8 开始。相当于 buf2.set(buf1.subarray(16, 20), 8);
console.log(buf2) // <Buffer 21 21 21 21 21 21 21 21 71 72 73 74 21 21 21 21 21 21 21 21 21 21 21 21 21 21>
console.log(buf2.toString('ascii')) // !!!!!!!!qrst!!!!!!!!!!!!!!