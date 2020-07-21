
from flask import request
from flask import jsonify
from flask_cors import CORS, cross_origin
from flask import render_template
from flask import Flask
import base64
from PIL import Image
import io
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from imutils import paths
import numpy as np
import argparse
import imutils
import pickle
import cv2
import os
from os import path
app = Flask(__name__)
deco=None
msg = None


print("[INFO] loading face detector...")
protoPath = "./face_detection_model/deploy.prototxt"
modelPath = "./face_detection_model/res10_300x300_ssd_iter_140000.caffemodel"
detector = cv2.dnn.readNetFromCaffe(protoPath, modelPath)
# load our serialized face embedding model from disk
print("[INFO] loading face recognizer...")
embedder = cv2.dnn.readNetFromTorch("./openface_nn4.small2.v1.t7")



@app.route("/train", methods=["POST"])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def train():
    print("Train started")
    # load the face embeddings
    print("[INFO] loading face embeddings...")
    data = pickle.loads(open("output/embeddings.pickle", "rb").read())
   
    message = request.get_json(force=True)
   
    name = message['name']
    print(message['name'])
    encoded = message['image']
    for i in encoded:
        decoded = base64.b64decode(i)
        image = Image.open(io.BytesIO(decoded))
        path_name="dataset/"+name
        if(not path.exists("dataset/"+name)):
            os.mkdir("dataset/"+name)
            image.save("dataset/"+name+"/id_"+str(0)+".png")
        else:
            length = len(list(paths.list_images(path_name)))
            image.save("dataset/"+name+"/id_"+str(length+1)+".png")

        image = np.array(image)

        frame = imutils.resize(image, width=600)
        (h, w) = frame.shape[:2]
        # construct a blob from the image
        imageBlob = cv2.dnn.blobFromImage(
            cv2.resize(frame, (300, 300)), 1.0, (300, 300),
            (104.0, 177.0, 123.0), swapRB=False, crop=False)

        # apply OpenCV's deep learning-based face detector to localize
        # faces in the input image
        detector.setInput(imageBlob)
        detections = detector.forward()

        i = np.argmax(detections[0, 0, :, 2])
        confidence = detections[0, 0, i, 2]
        # filter out weak detections
        if confidence > 0.5:
            # compute the (x, y)-coordinates of the bounding box for
            # the face
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            # extract the face ROI
            face = frame[startY:endY, startX:endX]
            (fH, fW) = face.shape[:2]
            # construct a blob for the face ROI, then pass the blob
            # through our face embedding model to obtain the 128-d
            # quantification of the face
            faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255,
                (96, 96), (0, 0, 0), swapRB=True, crop=False)
            embedder.setInput(faceBlob)
            vec = embedder.forward()

            data['embeddings'].append(vec.flatten())
            data['names'].append(name)
    # train the model used to accept the 128-d embeddings of the face and
    # then produce the actual face recognition
    le = LabelEncoder()
    labels = le.fit_transform(data['names'])
    print("[INFO] training model SVC with new data...")
    #training SVC with new Data
    recognizer = SVC(C=1.0, kernel="linear", probability=True)
    recognizer.fit(data["embeddings"], labels)
    # dump the facial embeddings + names to disk
    data = {"embeddings": data['embeddings'], "names": data['names']}
    f = open("output/embeddings.pickle", "wb")
    f.write(pickle.dumps(data))
    f.close()
    # write the actual face recognition model to disk
    f = open("output/recognizer.pickle", "wb")
    f.write(pickle.dumps(recognizer))
    f.close()
    # write the label encoder to disk
    f = open("output/le.pickle", "wb")
    f.write(pickle.dumps(le))
    f.close()
    print("Ceompleted Process")
    return jsonify({'status':True})




@app.route("/predict", methods=["POST"])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def predict():
    # load the actual face recognition model along with the label encoder
    recognizer = pickle.loads(open("output/recognizer.pickle", "rb").read())
    le = pickle.loads(open("output/le.pickle", "rb").read())
    print("hello started")
    message = request.get_json(force=True)
    encoded = message['image']
    decoded = base64.b64decode(encoded)
    global deco
    deco = decoded
    image = Image.open(io.BytesIO(decoded))
   
    image = np.array(image)
    frame = imutils.resize(image, width=600)
    (h, w) = frame.shape[:2]
    # construct a blob from the image
    imageBlob = cv2.dnn.blobFromImage(
        cv2.resize(frame, (300, 300)), 1.0, (300, 300),
        (104.0, 177.0, 123.0), swapRB=False, crop=False)

    # apply OpenCV's deep learning-based face detector to localize
    # faces in the input image
    detector.setInput(imageBlob)
    detections = detector.forward()

    i = np.argmax(detections[0, 0, :, 2])
    confidence = detections[0, 0, i, 2]
    # filter out weak detections
    if confidence > 0.5:
        # compute the (x, y)-coordinates of the bounding box for
        # the face
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        (startX, startY, endX, endY) = box.astype("int")

        # extract the face ROI
        face = frame[startY:endY, startX:endX]
        (fH, fW) = face.shape[:2]
        # construct a blob for the face ROI, then pass the blob
        # through our face embedding model to obtain the 128-d
        # quantification of the face
        faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255,
            (96, 96), (0, 0, 0), swapRB=True, crop=False)
        embedder.setInput(faceBlob)
        vec = embedder.forward()

        # perform classification to recognize the face
        preds = recognizer.predict_proba(vec)[0]
        j = np.argmax(preds)
        proba = preds[j]
        name = le.classes_[j]
        response = {
            'prediction': {
             'name': name,
                'prob': proba
            }
        }
        print(response)
        return jsonify(response)
    else:
        return jsonify({'name':'error'})

@app.route("/")
def hello():
    return jsonify({'name':'sajid'})
    
app.run()