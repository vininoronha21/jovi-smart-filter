// Monta um MP4 H.264 a partir dos quadros do screencast, respeitando os tempos reais.
// Uso: swift montar.swift <pasta-quadros> <saida.mp4> <limite-segundos>
import AVFoundation
import CoreGraphics
import ImageIO
import Foundation

let args = CommandLine.arguments
let pasta = URL(fileURLWithPath: args[1])
let saida = URL(fileURLWithPath: args[2])
let limite = Double(args[3]) ?? 45

struct Quadro: Decodable { let nome: String; let t: Double }
let quadros = try JSONDecoder().decode([Quadro].self, from: Data(contentsOf: pasta.appendingPathComponent("quadros.json")))
guard let t0 = quadros.first?.t else { fatalError("sem quadros") }

let largura = 1920, altura = 1080
try? FileManager.default.removeItem(at: saida)
let escritor = try AVAssetWriter(outputURL: saida, fileType: .mp4)
let entrada = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: largura, AVVideoHeightKey: altura,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 10_000_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoMaxKeyFrameIntervalKey: 60
  ]
])
entrada.expectsMediaDataInRealTime = false
let adaptador = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: entrada, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
  kCVPixelBufferWidthKey as String: largura, kCVPixelBufferHeightKey as String: altura
])
escritor.add(entrada)
escritor.startWriting()
escritor.startSession(atSourceTime: .zero)

func buffer(de url: URL) -> CVPixelBuffer? {
  guard let fonte = CGImageSourceCreateWithURL(url as CFURL, nil),
        let imagem = CGImageSourceCreateImageAtIndex(fonte, 0, nil) else { return nil }
  var pb: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptador.pixelBufferPool!, &pb)
  guard let px = pb else { return nil }
  CVPixelBufferLockBaseAddress(px, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(px), width: largura, height: altura, bitsPerComponent: 8,
                      bytesPerRow: CVPixelBufferGetBytesPerRow(px), space: CGColorSpaceCreateDeviceRGB(),
                      bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
  ctx.setFillColor(CGColor(red: 0.02, green: 0.02, blue: 0.03, alpha: 1))
  ctx.fill(CGRect(x: 0, y: 0, width: largura, height: altura))
  ctx.draw(imagem, in: CGRect(x: 0, y: 0, width: largura, height: altura))
  CVPixelBufferUnlockBaseAddress(px, [])
  return px
}

func anexar(_ px: CVPixelBuffer, _ segundos: Double) {
  while !entrada.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.005) }
  adaptador.append(px, withPresentationTime: CMTime(seconds: segundos, preferredTimescale: 600))
}

var ultimoTempo = -1.0
var ultimo: CVPixelBuffer?
var usados = 0
for q in quadros {
  let t = q.t - t0
  if t > limite { break }
  if t - ultimoTempo < 1.0 / 120 { continue }          // tempos estritamente crescentes
  guard let px = buffer(de: pasta.appendingPathComponent(q.nome)) else { continue }
  anexar(px, t)
  ultimoTempo = t; ultimo = px; usados += 1
}
// segura o último quadro até o fim (no máximo o limite)
let fim = min(limite, ultimoTempo + 1.0)
if let px = ultimo, fim > ultimoTempo + 0.01 { anexar(px, fim) }

entrada.markAsFinished()
let sem = DispatchSemaphore(value: 0)
escritor.finishWriting { sem.signal() }
sem.wait()
print("quadros usados:", usados, "duração:", String(format: "%.1f", fim), "s", "status:", escritor.status.rawValue, escritor.error?.localizedDescription ?? "")
