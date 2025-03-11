# BingBing

## Setup Frontend + Backend

Run the following commands in a new, empty project directory:

```sh
wsl # for windows
npm i
dfx start --clean --background
npm run backend
npm run frontend
```

## Setup AI

To set up the AI environments, follow these steps:

1. **Create Conda Environments**

   Use Conda to create the required environments. You'll need to set up two environments:

   - **Primary Environment**: Defined in the `environment.yml` file located in the root directory.
   - **Cloth Mask Environment**: Defined in the `./cloth_mask/environment.yml` file.

   ### Creating Environments

   To create these environments, run the following commands:

   ```bash
   # Create the primary environment
   conda env create -f environment.yml

   # Create the cloth mask environment
   conda env create -f ./cloth_mask/environment.yml

2. **Download OpenPose Quick Installation**
    
    You can get the pre-trained model from https://www.kaggle.com/datasets/changethetuneman/openpose-model and you can get the windows portable demo from https://github.com/CMU-Perceptual-Computing-Lab/openpose/releases and unzip it in the ai folder make sure to put the models inside models folder following the placement in getModels.sh 

3. **Download Model For Cloth Masking**

    Using the cloth mask environment make sure to download the model before using it

    ``` bash
    from carvekit.ml.files.models_loc import download_all
    download_all();

4. **Download Model For Human Parsing**

    The model can be obtained from https://drive.google.com/file/d/1qkk6GZjEOJnu3mXHLe1QMBiP3wL_l3XN/view?usp=drive_link make sure to put it in the Human-Parsing Folder

5. **Download Model For VITON-HD**

    We provide pre-trained networks. Please download *.pkl from the https://drive.google.com/drive/folders/0B8kXrnobEVh9fnJHX3lCZzEtd20yUVAtTk5HdWk2OVV0RGl6YXc0NWhMOTlvb1FKX3Z1OUk?resourcekey=0-OIXHrDwCX8ChjypUbJo4fQ folder and unzip *.zip files. test.py assumes that the downloaded files are placed in ./checkpoints/ directories.

## Environment Variable Configuration for Visual Studio

This is needed for running some parts of the AI

### Adding Paths to the Path Environment Variable

1. **Open Environment Variables:**
   - Search for "Environment Variables" in the Start menu and select "Edit the system environment variables".
   - Click on the "Environment Variables" button.

2. **Update the `Path` Variable:**
   - Under "System variables", find and select the `Path` variable, then click "Edit".
   - Add the following paths to the `Path` variable. Make sure to separate them with a semicolon (`;`):

     ```
     E:\VS2017\VC\Tools\MSVC\14.10.25017\bin\HostX64\x64;
     E:\VS2017\Common7\IDE
     ```
   - If your system is 32-bit or if HostX64\x64 is not available, use HostX86\x86 instead.

### Creating the `LIB` Variable

1. **Add a New Variable:**
   - In the "Environment Variables" window, under "System variables", click "New".

2. **Set the Variable Name and Value:**
   - **Variable name:** `LIB`
   - **Variable value:** Add the following paths, separated by semicolons (`;`):

     ```
     C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC\Tools\MSVC\14.10.25017\lib\x64;
     C:\Program Files (x86)\Windows Kits\10\Lib\10.0.14393.0\ucrt\x86;
     C:\Program Files (x86)\Windows Kits\8.1\Lib\winv6.3\um\x86;
     ```

   - If the `HostX64\x64` path is set in the `Path` variable, use the `x64` lib path. If not, adjust accordingly.

### Creating the `INCLUDE` Variable

1. **Add a New Variable:**
   - In the "Environment Variables" window, under "System variables", click "New".

2. **Set the Variable Name and Value:**
   - **Variable name:** `INCLUDE`
   - **Variable value:** Add the following paths, separated by semicolons (`;`):

     ```
     E:\VS2017\VC\Tools\MSVC\14.10.25017\include;
     C:\Program Files (x86)\Windows Kits\10\Include\10.0.14393.0\ucrt;
     ```

## Resources

- **Pose Estimation:**
  - [OpenPose GitHub Repository](https://github.com/CMU-Perceptual-Computing-Lab/openpose)

- **Human Parsing:**
  - [Self-Correction Human Parsing GitHub Repository](https://github.com/GoGoDuck912/Self-Correction-Human-Parsing)

- **Cloth Masking and setup help:**
  - [HR-VITON Issue #45](https://github.com/sangyun884/HR-VITON/issues/45#issue-1515217009)

- **VITON-HD:**
  - [VITON-HD GitHub Repository](https://github.com/shadow2496/VITON-HD)
 
- **Environment Variable Configuration Issue:**
  - [Environment Variable Configuration for Visual Studio](https://github.com/HRNet/HRNet-Semantic-Segmentation/issues/39)
 

## Additional Links
- **Project Summary and Overview:**
  - https://www.canva.com/design/DAGPVHGakhU/HoWbz7FAmP4QlXhJQleBXg/edit?utm_content=DAGPVHGakhU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
- **Project Demo**
  - https://drive.google.com/drive/u/0/folders/1rrgNoPQlcMplkqfyol-KPsQNCGF4KU-P

