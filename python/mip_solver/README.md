# MIP Solver
  
This code snippet demonstrates MIP Solver module, written by me. The code for the module itself is not provided.

Module provides high level python API over MIP solvers. Supports [CBC](https://projects.coin-or.org/Cbc) and [CPLEX](https://www.ibm.com/analytics/cplex-optimizer) MIP optimizers.

Initialize CBC solver and provide _bound_ and _solution_ callbacks.

    self.solver = Solver(Solver.CBC, self.bound, self.solution)

Create two non-negative Integer variables.

    self.x = self.solver.addInteger('x', lower_bound=0., upper_bound=None)
    self.y = self.solver.addInteger('y', lower_bound=0., upper_bound=None)

Define four conditions.

    self.solver.addCondition(self.x + 7 * self.y <= 17.5)
    self.solver.addCondition(self.x <= 3.5)
    self.solver.addCondition(self.x >= 0)
    self.solver.addCondition(self.y >= 0)

Solve maximization problem.

    self.solver.maximize(self.x + 10 * self.y)

Expected output.

    > 23.0000
    > 23.0000	x = 3	y = 2

This is a good alternative for [Google OR Tools](https://developers.google.com/optimization/mip/integer_opt), mainly because of callbacks.
You receive not only the last solution but also all the intermediate ones.
