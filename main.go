package main

import(
	"sync"
	"fmt"
) 

// 전역 대기 그룹 선언
var wg = &sync.WaitGroup{}

func main() {
	myChannel := make(chan int)
	// 대기 그룹의 내부 카운터를 2만큼 증가
	wg.Add(2)
	go runLoopSend(10, myChannel)
	go runLoopReceive(myChannel)
	// wait group의 내부 카운터가 0이 될 때까지 대기
	wg.Wait()
}

func runLoopSend(n int, ch chan int){
	// 함수 실행이 끝나면 대기 그룹 내부 카운터 1만큼 감소
	defer wg.Done()
	for i := 0; i < n; i++ {
		ch <- i
	}
	close(ch)
}

func runLoopReceive(ch chan int)  {
	// 함수 실행이 끝나면 대기 그룹 내부 카운터 1만큼 감소
	defer wg.Done()
	for i := range ch {
		fmt.Println("Received value: ", i)
 	}
} 