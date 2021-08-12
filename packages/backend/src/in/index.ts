import { gstInputPort } from '../common/config'
import Koa from 'koa'
import Router from '@koa/router'
import inflate from 'inflation'
import raw from 'raw-body'
import { getRoom } from '../common/rooms'

const splitChunk = (
  savedBuffer: Buffer | undefined,
  incoming: Buffer,
  chunkSize: number
): [Buffer[], Buffer?] => {
  let combined = savedBuffer ? Buffer.concat([savedBuffer, incoming]) : incoming

  const newBuffers: Buffer[] = []

  // Loop through all full chunks
  let offset
  for (offset = 0; offset < combined.length - chunkSize; offset += chunkSize) {
    newBuffers.push(combined.slice(offset, offset + chunkSize))
  }

  const remainingBytes = combined.length - offset

  if (remainingBytes > 0) {
    return [newBuffers, combined.slice(offset)]
  }
  return [newBuffers]
}

const processIncomingChunk = (id: string, incomingChunk: Buffer) => {
  const room = getRoom(id)

  const [fullChunks, overflow] = splitChunk(
    room.partial_chunk,
    incomingChunk,
    room.settings.chunkSize
  )

  fullChunks.forEach((buffer) =>
    room.chunks.enqueue({ data: buffer, ts: Date.now() })
  )

  // Limit our queue by skipping old chunks. The queue could grow too big if either
  // 1. The input source is feeding us data too quickly
  // 2. No clients are connected, so the consuming loop doesn't run
  while (room.chunks.size > room.settings.maxQueueSize) {
    room.chunks.dequeue()
  }

  room.partial_chunk = overflow
}

export const createInputServer = () => {
  const app = new Koa()
  const router = new Router()

  router.put('/:streamId/soup', async (ctx, next) => {
    const id = ctx.params.streamId
    const incomingChunk = await raw(inflate(ctx.req))

    processIncomingChunk(id, incomingChunk)

    ctx.body = ''
  })

  app.use(router.routes()).use(router.allowedMethods())

  app.listen(gstInputPort)
  console.log(`in server listening on port ${gstInputPort}`)
}
