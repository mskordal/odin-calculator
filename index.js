const State = Object.freeze({
	NONE: 0,
	NUM1_PRESSED: 1,
	OP_PRESSED: 2,
	NUM2_PRESSED: 3
});

const operation =
{
	num1: "0",
	op: "+",
	num2: "0",
	state: State.NONE,
	decimal_added: false,
	do_operation()
	{
		if (this.op == "+")
		{
			return Number(this.num1) + Number(this.num2);
		}
		else if (this.op == "-")
		{
			return Number(this.num1) - Number(this.num2);
		}
		else if (this.op == "*")
		{
			return Number(this.num1) * Number(this.num2);
		}
		else /* division */
		{
			if(this.num2 == 0) return "Error";
			return Number(this.num1) / Number(this.num2);
		}
	}
}


const screen_txt = document.querySelector("#screen p");


function click_num(event)
{
	let num = event.target.closest("div").dataset.num;

	if (num == "." && operation.decimal_added) return;

	if (operation.state == State.NONE)
	{
		if (num == "0") return;
		if (operation.num1 == ".")
		{
			operation.num1 = "0.";
			operation.decimal_added = true;
		}
		else
		{
			operation.num1 = num;
		}
		operation.state = State.NUM1_PRESSED;
		screen_txt.innerText = operation.num1;
		return;
	}
	else if (operation.state == State.NUM1_PRESSED)
	{
		operation.num1 += num;
		if (num == ".") operation.decimal_added = true;
		screen_txt.innerText = operation.num1;
		return;
	}
	else if (operation.state == State.OP_PRESSED)
	{
		if (num == ".")
		{
			operation.num2 = "0.";
			operation.decimal_added = true;
		}
		else
		{
			operation.num2 = num;
		}
		operation.state = State.NUM2_PRESSED;
		screen_txt.innerText = operation.num2;
		return;
	}
	else if (operation.state == State.NUM2_PRESSED)
	{
		operation.num2 += num;
		if (num == ".") operation.decimal_added = true;
		screen_txt.innerText = operation.num2;
		return;
	}
}

function click_op(event)
{
	let op = event.target.closest("div").dataset.op;

	if (operation.state == State.NONE)
	{
		return;
	}		
	else if (operation.state == State.NUM1_PRESSED)
	{
		operation.op = op;
		operation.state = State.OP_PRESSED;
		return;
	}
	else if (operation.state == State.OP_PRESSED)
	{
		operation.op = op;
		return;
	}
	else /* NUM2_PRESSED */
	{
		let result = operation.do_operation().toString();
		screen_txt.innerText = result;
		operation.num1 = result;
		operation.op = op;
		operation.state = State.OP_PRESSED;
		return;
	}
}

function click_eval()
{
	if (operation.state == State.NONE || operation.state == State.NUM1_PRESSED)
	{
		return;
	}
	else if (operation.state == State.OP_PRESSED)
	{
		operation.num2 = operation.num1;
	}
	/* Do operation for OP_PRESSED and NUM2_PRESSED states */
	let result = operation.do_operation().toString();
	screen_txt.innerText = result;
	operation.num1 = result;
	operation.state = State.NUM1_PRESSED;
}

function click_clear()
{
	if (operation.state == State.NONE)
	{
		return;
	}		
	else if (operation.state == State.NUM1_PRESSED)
	{
		screen_txt.innerText = "0";
		operation.state = State.NONE;
		return;
	}
	else if (operation.state == State.OP_PRESSED)
	{
		operation.state = State.NUM1_PRESSED;
		return;
	}
	else if (operation.state == State.NUM2_PRESSED)
	{
		screen_txt.innerText = operation.num1;
		operation.state = State.OP_PRESSED;
		return;
	}
}

const num_btns = document.querySelectorAll("div[data-num]");
const op_btns = document.querySelectorAll("div[data-op]");
const eval_btn = document.querySelector("#eval");
const clear_btn = document.querySelector("#clear");

num_btns.forEach(btn => btn.addEventListener("click", click_num));
op_btns.forEach(btn => btn.addEventListener("click", click_op));
eval_btn.addEventListener("click", click_eval);
clear_btn.addEventListener("click", click_clear);