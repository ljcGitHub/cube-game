float speed = 6; 

float horizontal = Input.getAxisRaw('Horizontal');
float vertical = Input.getAxisRaw('Vertical');
Vector3 dicrection = new Vector3(horizontal, 0, vertical).normalized;

if (dicrection.magnitude >= 0.1) {
  float targetAngle = Math.Atan2(dicrection.x, dicrection.z) * Mathf.Rad2Deg/*弧度转角度*/ + cam.eulerAngles,y/*俯视角值*/; 
  float angle = Math.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnSmoothVelocity, 0.1)
  transform.rotation = Quaternion.Euler(0, angle, 0);

  Vector3 moveDir = Quaternion.Euler(0, targetAngle, 0) * Vector3.forward

  controller.move(moveDir.normalized * speed * Time * deltaTime)
}    