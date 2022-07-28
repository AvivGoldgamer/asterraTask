import numpy as np
from PIL import Image as img

#Calculate the log in base 10
def calc_log(num):

    # check the number because log10 cannot calculate 0 or negative numbers
    if(num**2 > 0):
        log_data = 10 * np.log10(num**2)

        if(log_data < 13):
            return 2 * (log_data**2)
    
    return num

# Create an array(matrix) with random numbers
array = np.random.randint(65535, size=(1000, 10000))

# Apply the function calc_log to every value in the array
new_array = np.vectorize(calc_log)(array)

# Create an image out of the array
image = img.fromarray(new_array)

# Save the image
image.save('resultImage.png')
