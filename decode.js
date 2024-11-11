import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.*;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

public class SSTVJavaServer {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/decode", new DecodeHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Java server started on port 8080");
    }

    static class DecodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                // Чтение файла
                InputStream inputStream = exchange.getRequestBody();
                File audioFile = new File("uploaded_audio.wav");
                try (FileOutputStream outStream = new FileOutputStream(audioFile)) {
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outStream.write(buffer, 0, bytesRead);
                    }
                }

                // Передача файла на Python для обработки
                ProcessBuilder processBuilder = new ProcessBuilder("python3", "decode_audio.py", audioFile.getAbsolutePath());
                processBuilder.redirectErrorStream(true);
                Process process = processBuilder.start();

                // Ожидание завершения Python процесса
                process.waitFor();

                // Чтение результата Python обработки
                File imageFile = new File("decoded_image.png");
                BufferedImage decodedImage = ImageIO.read(imageFile);
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ImageIO.write(decodedImage, "PNG", outputStream);

                // Отправка результата на клиент
                byte[] imageBytes = outputStream.toByteArray();
                exchange.getResponseHeaders().set("Content-Type", "image/png");
                exchange.sendResponseHeaders(200, imageBytes.length);
                OutputStream responseStream = exchange.getResponseBody();
                responseStream.write(imageBytes);
                responseStream.close();

            } else {
                exchange.sendResponseHeaders(405, -1); // Метод не разрешен
            }
        }
    }
}
