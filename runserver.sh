case "$1" in
    build)
        mvn clean package -DskipTests
        scp -i abet_ec2.pem -r target/abet-cse-0.0.1.jar ubuntu@13.214.16.222:~/abet-cse
        ;;
    move)
        scp -i abet_ec2.pem -r target/abet-cse-0.0.1.jar ubuntu@13.214.16.222:~/abet-cse
        ;;
    start)
        nohup java -jar abet-cse-0.0.1.jar &
        echo "Abet CSE started on port 8000"
        ;;
    stop)
        kill $(lsof -t -i:8000)
        rm -rf abet-cse-0.0.1.jar nohup.out
        ;;
    *)
        echo "Usage: `basename $0` start|build|move|stop"
esac