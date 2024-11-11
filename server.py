from flask import Flask, request, send_file
from io import BytesIO
from pysstv.color import Robot36
from pydub import AudioSegment

app = Flask(__name__)

@app.route('/decode', methods=['POST'])
def decode_sstv():
    file = request.files['audio']
    if not file:
        return {"error": "Аудиофайл не загружен."}, 400
    
    # Загружаем и обрабатываем аудиофайл
    audio = AudioSegment.from_file(file)
    
    # Конвертируем аудио в формат, пригодный для обработки SSTV
    # Здесь может понадобиться анализ для определения типа, это просто пример
    sstv = Robot36(audio.raw_data, sample_rate=audio.frame_rate)
    
    # Декодируем в изображение
    image = sstv.decode()
    
    # Отправляем изображение обратно в JavaScript
    img_io = BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
