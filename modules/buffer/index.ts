import { Buffer } from 'buffer'
/**
 * 基本使用
 */
// const buf1 = Buffer.alloc(10) // 创建一个长度为 10、且用 0 填充的 Buffer
// const buf2 = Buffer.alloc(10, 1) // 创建一个长度为 10、且用 0x1 填充的 Buffer
// const buf3 = Buffer.allocUnsafe(10) // 创建一个长度为 10、且未初始化的 Buffer。这个方法比调用 Buffer.alloc() 更快，但返回的 Buffer 实例可能包含旧数据，因此需要使用 fill() 或 write() 重写。
// const buf4 = Buffer.from([1, 2, 3]) // 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
// const buf5 = Buffer.from('tést') // 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
// const buf6 = Buffer.from('tést', 'latin1') // 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。

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
// const buf8 = Buffer.from(arrBuffer)
// buf8[0] = 1
// console.log(int32Array) // Int32Array(4) [ 1, 1, 2, 3 ]

// const buf9 = Buffer.from('hello', 'utf16le')
// const unit16Array = new Uint16Array(buf9.buffer, buf9.byteOffset, buf9.length / Uint16Array.BYTES_PER_ELEMENT)
// console.log(unit16Array) // Uint16Array(5) [ 104, 101, 108, 108, 111 ]
// buf9[0] = 1
// console.log(unit16Array) // Uint16Array(5) [ 1, 101, 108, 108, 111 ]

const buf1 = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f])
console.log(buf1.toString('base64')) // aGVsbG8=
